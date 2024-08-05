"use server";

import { prisma } from "@/lib/initPrisma"; // Adjust this import based on your Prisma client setup
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { generateFeedback } from "../langchainGenerations/generateFeedback";

interface SubmitResponsesParams {
  assessmentId: string;
  assessmentTitle: string;
  assessmentObjectives: string;
  responses: Record<string, string>; // { [assessmentItemId]: answerId }
}

interface IncorrectResponse {
  question: string;
  givenAnswer: string;
  correctAnswer: string;
}

export async function submitResponses({
  assessmentId,
  assessmentTitle,
  assessmentObjectives,
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
    // Initialise an array of incorrect responses
    const incorrectResponses: IncorrectResponse[] = [];
    let submissionId: string;

    // Start a transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Create a new submission
      const submission = await prisma.submission.create({
        data: {
          assessmentId,
          userId,
        },
      });

      // Save the submission ID
      submissionId = submission.id;  

      // Process each response
      const responsePromises = Object.entries(responses).map(
        async ([assessmentItemId, answerId]) => {
          const [assessmentItem, correctAnswer, givenAnswer] =
            await Promise.all([
              prisma.assessmentItem.findUnique({
                where: { id: assessmentItemId },
                include: { answers: true },
              }),
              prisma.answer.findFirst({
                where: {
                  assessmentItemId,
                  isCorrect: true,
                },
              }),
              prisma.answer.findUnique({
                where: { id: answerId },
              }),
            ]);

          // Check if the given answer is correct
          const isCorrect = correctAnswer?.id === answerId;

          // Add the incorrect response to a list for feedback writing.
          if (!isCorrect && assessmentItem && correctAnswer && givenAnswer) {
            incorrectResponses.push({
              question: assessmentItem.content,
              givenAnswer: givenAnswer.content,
              correctAnswer: correctAnswer.content,
            });
          }

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
      const correctResponses = totalResponses - incorrectResponses.length;

      const score = (correctResponses / totalResponses) * 100;

      /// Update the submission with the score
      const updatedSubmission = await prisma.submission.update({
        where: { id: submission.id },
        data: { score },
      });

      return { submissionId: submission.id, score };
    });

    // Generate feedback based on the results (outside the transaction)
    const feedbackContent = await generateFeedback({
      assessmentTitle,
      assessmentObjectives,
      incorrectResponses,
    });

    // Update Submission with feedback
    await prisma.submission.update({
      where: {
        id: result.submissionId, 
      },
      data: {
        feedback: feedbackContent,
      },
    });

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
