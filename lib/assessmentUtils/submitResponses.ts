"use server";

import { prisma } from "@/lib/initPrisma";
import { auth } from "@clerk/nextjs/server";
import { generateFeedback } from "../langchainGenerations/generateFeedback";

interface SubmitResponsesParams {
  assessmentId: string;
  assessmentTitle: string;
  assessmentObjectives: string;
  responses: Record<string, string>;
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
    const incorrectResponses: IncorrectResponse[] = [];

    // Create a new submission
    const submission = await prisma.submission.create({
      data: {
        assessmentId,
        userId,
      },
    });

    const submissionId = submission.id;

    // Process each response
    for (const [assessmentItemId, answerId] of Object.entries(responses)) {
      const assessmentItem = await prisma.assessmentItem.findUnique({
        where: { id: assessmentItemId },
        include: { answers: true },
      });

      const correctAnswer = await prisma.answer.findFirst({
        where: {
          assessmentItemId,
          isCorrect: true,
        },
      });

      const givenAnswer = await prisma.answer.findUnique({
        where: { id: answerId },
      });

      const isCorrect = correctAnswer?.id === answerId;

      if (!isCorrect && assessmentItem && correctAnswer && givenAnswer) {
        incorrectResponses.push({
          question: assessmentItem.content,
          givenAnswer: givenAnswer.content,
          correctAnswer: correctAnswer.content,
        });
      }

      await prisma.response.create({
        data: {
          submissionId,
          assessmentItemId,
          userId,
          givenAnswerId: answerId,
          isCorrect,
        },
      });
    }

    // Calculate the score
    const totalResponses = Object.keys(responses).length;
    const correctResponses = totalResponses - incorrectResponses.length;
    const score = (correctResponses / totalResponses) * 100;

    // Update the submission with the score
    await prisma.submission.update({
      where: { id: submissionId },
      data: { score },
    });

    // Generate feedback based on the results
    const feedbackContent = await generateFeedback({
      assessmentTitle,
      assessmentObjectives,
      incorrectResponses,
    });

    // Update Submission with feedback
    await prisma.submission.update({
      where: {
        id: submissionId,
      },
      data: {
        feedback: feedbackContent,
      },
    });

    return { success: true, submissionId, score };
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