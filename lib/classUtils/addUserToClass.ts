"use server";

import { prisma } from "../initPrisma";

export async function addUserToClass(classId: string, userId: string) {
  try {
    // Find the class
    const classToJoin = await prisma.class.findUnique({
      where: { id: classId },
    });

    if (!classToJoin) {
      throw new Error("Class not found");
    }

    // Check if user is already a member of the class
    const existingMembership = await prisma.class.findFirst({
      where: {
        id: classId,
        members: {
          some: {
            id: userId,
          },
        },
      },
    });

    if (existingMembership) {
      throw new Error("Student is already a member of this class");
    }

    // Add user to the class as a student
    await prisma.class.update({
      where: { id: classId },
      data: {
        members: {
          connect: { id: userId },
        },
      },
    });

    // Delete any associateed join requests for students who may have requested to join that class.
    await prisma.issue.deleteMany({
        where: {
            raisedById: userId,
            relevantClassId: classId,
            type: "CLASS_JOIN_REQUEST"
        },
    })

    return { success: true };
  } catch (error) {
    console.error("Error adding user to class:", error);
    throw error;
  }
}
