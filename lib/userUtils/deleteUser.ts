"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "../initPrisma";

export async function deleteUser() {
  try {
    const { userId } = auth();

    if (!userId) {
      throw new Error("User is not authenticated");
    }

    // Delete classes where the user is the only teacher
    // This will cascade delete related records as per the schema
    await prisma.class.deleteMany({
      where: {
        taughtBy: {
          every: {
            id: userId,
          },
        },
      },
    });

    // Delete the user profile
    await prisma.user.delete({ where: { id: userId } });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}



