"use server"

import { auth } from "@clerk/nextjs/server";
import { prisma } from "../initPrisma";

export async function deleteClass(classId: string) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  try {
    // First, fetch the class to ensure it exists and the user has permission to delete it
    const existingClass = await prisma.class.findUnique({
      where: { id: classId },
      select: { createdById: true }
    });

    if (!existingClass) {
      throw new Error("Class not found");
    }

    // Check if the current user is the creator of the class
    if (existingClass.createdById !== userId) {
      throw new Error("User does not have permission to delete this class");
    }

    // Delete the class
    await prisma.class.delete({
      where: { id: classId },
    });

    return { success: true, message: "Class deleted successfully" };
  } catch (error) {
    console.error("Error deleting class:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}