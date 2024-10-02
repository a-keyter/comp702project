"use server"

import { auth } from "@clerk/nextjs/server";
import { prisma } from "../initPrisma";
import { addUserToClass } from "../classUtils/addUserToClass";
import { newClassNotification } from "../notificationUtils/newClassNotification";

export default async function bulkAddStudentsToClass(
  classId: string,
  studentEmails: string[]
) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Check if the user has permission to add students to this class
  const classDetails = await prisma.class.findUnique({
    where: { id: classId },
    include: { taughtBy: true },
  });

  if (!classDetails || !classDetails.taughtBy.some(teacher => teacher.id === userId)) {
    throw new Error("You don't have permission to add students to this class");
  }

  // Find existing users
  const existingUsers = await prisma.user.findMany({
    where: {
      email: { in: studentEmails },
      role: "STUDENT",
    },
    select: { id: true, email: true },
  });

  const existingUserEmails = new Set(existingUsers.map(user => user.email));

  // Check class membership and add students if they're not already members
  const addExistingStudentsPromises = existingUsers.map(async (user) => {
    try {
      await addUserToClass(classId, user.id);
      await newClassNotification(classId, userId, user.id);
      return { success: true, email: user.email };
    } catch (error) {
      if (error instanceof Error && error.message === "Student is already a member of this class") {
        return { success: false, email: user.email, reason: "already_member" };
      }
      // If it's not the expected error, re-throw it
      throw error;
    }
  });

  const addResults = await Promise.allSettled(addExistingStudentsPromises);

  // Queue invitations for non-existing students
  const nonExistingEmails = studentEmails.filter(email => !existingUserEmails.has(email));
  const queueInvitationsPromises = nonExistingEmails.map(email =>
    prisma.queuedClassJoin.create({
      data: {
        email,
        class: { connect: { id: classId } },
        raisedBy: { connect: { id: userId } },
      },
    })
  );

  await Promise.all(queueInvitationsPromises);

  const successfullyAdded = addResults.filter(
    (result): result is PromiseFulfilledResult<{ success: true; email: string }> => 
      result.status === "fulfilled" && result.value.success
  ).length;

  const alreadyMembers = addResults.filter(
    (result): result is PromiseFulfilledResult<{ success: false; email: string; reason: "already_member" }> => 
      result.status === "fulfilled" && !result.value.success && result.value.reason === "already_member"
  ).length;

  return {
    addedStudents: successfullyAdded,
    alreadyMembers: alreadyMembers,
    queuedInvitations: nonExistingEmails.length,
  };
}