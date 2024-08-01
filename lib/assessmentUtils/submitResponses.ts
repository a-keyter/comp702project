"use server";

// @/lib/assessmentUtils/submitResponses.ts

import { prisma } from "@/lib/initPrisma"; // Adjust this import based on your Prisma client setup
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

interface SubmitResponsesParams {
  assessmentId: string;
  responses: Record<string, string>; // { [assessmentItemId]: answerId }
}

export async function submitResponses({
  assessmentId,
  responses,
}: SubmitResponsesParams) {
  const { userId } = auth();

  if (!userId) {
    return {
      success: false,
      error: "Failed to submit responses",
      submissionId: "404",
      score: 0,
    };
  }

  try {
    // Start a transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Create a new submission
      const submission = await prisma.submission.create({
        data: {
          assessmentId,
          userId,
        },
      });

      // Process each response
      const responsePromises = Object.entries(responses).map(
        async ([assessmentItemId, answerId]) => {
          // Get the correct answer for this assessment item
          const correctAnswer = await prisma.answer.findFirst({
            where: {
              assessmentItemId,
              isCorrect: true,
            },
          });

          // Check if the given answer is correct
          const isCorrect = correctAnswer?.id === answerId;

          // Create the response
          return prisma.response.create({
            data: {
              submissionId: submission.id,
              assessmentItemId,
              userId,
              givenAnswerId: answerId,
              isCorrect,
            },
          });
        }
      );

      // Wait for all responses to be created
      await Promise.all(responsePromises);

      // Calculate the score
      const totalResponses = Object.keys(responses).length;
      const correctResponses = await prisma.response.count({
        where: {
          submissionId: submission.id,
          isCorrect: true,
        },
      });

      const score = (correctResponses / totalResponses) * 100;

      // Update the submission with the score
      await prisma.submission.update({
        where: { id: submission.id },
        data: { score },
      });

      return { submissionId: submission.id, score };
    });

    // Revalidate the assessment page
    revalidatePath(`/assessments/${assessmentId}`);

    return { success: true, ...result };
  } catch (error) {
    console.error("Error submitting responses:", error);
    return {
      success: false,
      error: "Failed to submit responses",
      submissionId: "404",
      score: 0,
    };
  }
}
