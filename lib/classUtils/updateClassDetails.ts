"use server"

import { auth } from "@clerk/nextjs/server";
import { prisma } from "../initPrisma";

export async function updateClassDetails(classId: string, updatedData: { title: string; description: string }) {
    const { userId } = auth();
  
    if (!userId) {
      throw new Error("User not authenticated");
    }
  
    try {
      // First, fetch the class to ensure it exists and the user has permission to update it
      const existingClass = await prisma.class.findUnique({
        where: { id: classId },
        // Include Teacher Data
        include: { taughtBy: true }
      });
  
      if (!existingClass) {
        throw new Error("Class not found");
      }
  
      // Check if the current user is the creator of the class
      if (existingClass.taughtBy.some(teacher => teacher.id !== userId)) {
        throw new Error("User does not have permission to update this class");
      }
  
      // Update the class details
      const updatedClass = await prisma.class.update({
        where: { id: classId },
        data: {
          title: updatedData.title,
          description: updatedData.description,
          updatedAt: new Date(), // Update the 'updatedAt' timestamp
        },
      });
  
      return updatedClass;
    } catch (error) {
      console.error("Error updating class details:", error);
      throw error;
    } finally {
      await prisma.$disconnect();
    }
  }