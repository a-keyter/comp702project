"use server"

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "../initPrisma";
import { getUserByNickname } from "./getUserDetails";

export async function deleteUserByNickname(nickname: string) {
  try {
    // Fetch the current user using Clerk auth
    const currentClerkUser = await currentUser();

    if (!currentClerkUser) {
      throw new Error("User is not authenticated");
    }

    // Fetch the user from the database using the provided nickname
    const userToDelete = await getUserByNickname(nickname);

    if (!userToDelete) {
      throw new Error("User not found");
    }

    // Check if the current user is trying to delete their own profile
    if (userToDelete.id !== currentClerkUser.id) {
      throw new Error("You can only delete your own profile");
    }

    // Find classes where the user is the only teacher
    const classesToDelete = await prisma.class.findMany({
      where: {
        taughtBy: {
          every: {
            id: userToDelete.id
          }
        }
      }
    });

    // Delete classes where the user is the only teacher
    if (classesToDelete.length > 0) {
      await prisma.class.deleteMany({
        where: {
          id: {
            in: classesToDelete.map(c => c.id)
          }
        }
      });
    }

    // Delete the user
    // This will cascade delete related records as per the schema
    await prisma.user.delete({ where: { id: userToDelete.id } });

    return { 
      success: true, 
      message: "User and associated data deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}