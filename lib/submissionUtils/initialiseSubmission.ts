"use server"

import { auth } from "@clerk/nextjs/server";
import { prisma } from "../initPrisma";

export async function initialiseSubmission(assessmentId: string) {
    const { userId } = auth();
    if (!userId) {
      return { success: false, error: "User not authenticated" };
    }
  
    try {
      const submission = await prisma.submission.create({
        data: {
          assessmentId,
          userId,
        },
      });
      return { success: true, submissionId: submission.id };
    } catch (error) {
      console.error("Error initializing submission:", error);
      return { success: false, error: "Failed to initialize submission" };
    }
  }