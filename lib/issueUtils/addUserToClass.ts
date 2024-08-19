"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "../initPrisma";
import { getUserByEmail } from "../userUtils/getUserDetails";
import { newClassNotification } from "../notificationUtils/newClassNotification";
import { deleteJoinRequestNotifications } from "../notificationUtils/deleteJoinRequestNotification";

export async function addUserToClass(issueId: string, newUserEmail: string, classCode: string) {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  const newUser = await getUserByEmail(newUserEmail);

  if (!newUser) {
    throw new Error("User not found");
  }

  try {
    // Find the class
    const classToJoin = await prisma.class.findUnique({
      where: { id: classCode },
    });

    if (!classToJoin) {
      throw new Error("Class not found");
    }

    // Check if user is already a member of the class
    const existingMembership = await prisma.class.findFirst({
      where: {
        id: classCode,
        members: {
          some: {
            email: newUserEmail,
          },
        },
      },
    });

    if (existingMembership) {
      throw new Error("User is already a member of this class");
    }

    // Add user to the class, either as teacher or as student
    if (newUser.role === "TEACHER") {
      await prisma.class.update({
        where: { id: classCode },
        data: {
          taughtBy: {
            connect: { id: newUser.id },
          },
        },
      });
    } else if (newUser.role === "STUDENT") {
      await prisma.class.update({
        where: { id: classCode },
        data: {
          members: {
            connect: { id: newUser.id },
          },
        },
      });
    }

    // Update the issue status, last updated time, and last updated by
    await prisma.issue.update({
      where: { id: issueId },
      data: {
        status: "RESOLVED",
        updatedAt: new Date(),
        lastUpdatedBy: {
          connect: { id: userId },
        },
      },
    });

    await newClassNotification(classCode, userId, newUser.id)
    await deleteJoinRequestNotifications(issueId)

    return { success: true };
  } catch (error) {
    console.error("Error adding user to class:", error);
    throw error;
  }
}
