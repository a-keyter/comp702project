"use server";

import { prisma } from "../initPrisma";
import { getUserById } from "../userUtils/getUserDetails";

export async function addUserToClass(newUserId: string, classCode: string) {
  const newUser = await getUserById(newUserId);

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
            id: newUserId,
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
            connect: { id: newUserId },
          },
        },
      });
    } else if (newUser.role === "STUDENT") {
      await prisma.class.update({
        where: { id: classCode },
        data: {
          members: {
            connect: { id: newUserId },
          },
        },
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Error adding user to class:", error);
    throw error;
  }
}
