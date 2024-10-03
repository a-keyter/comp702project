"use server"

import { auth } from "@clerk/nextjs/server";
import { prisma } from "../initPrisma";

export interface IncorrectResponse {
  question: string;
  givenAnswer: string;
  correctAnswer: string;
}

export async function submitResponses(submissionId: string, responses: Record<string, string>) {
  const { userId } = auth();
  if (!userId) {
    return { success: false, error: "User not authenticated" };
  }

  try {
    const results = await Promise.all(
      Object.entries(responses).map(async ([assessmentItemId, answerId]) => {
        const [assessmentItem, correctAnswer, givenAnswer] = await Promise.all([
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

        const isCorrect = correctAnswer?.id === answerId;

        await prisma.response.create({
          data: {
            submissionId,
            assessmentItemId,
            userId,
            givenAnswerId: answerId,
            isCorrect,
          },
        });

        if (!isCorrect && assessmentItem && correctAnswer && givenAnswer) {
          return {
            isCorrect,
            incorrectResponse: {
              question: assessmentItem.content,
              givenAnswer: givenAnswer.content,
              correctAnswer: correctAnswer.content,
            },
          };
        }

        return { isCorrect };
      })
    );

    const totalResponses = results.length;
    const correctResponses = results.filter(r => r.isCorrect).length;
    const incorrectResponses = results
      .filter(r => !r.isCorrect && 'incorrectResponse' in r)
      .map(r => (r as { incorrectResponse: IncorrectResponse }).incorrectResponse);

    return { 
      success: true, 
      totalResponses,
      correctResponses,
      incorrectResponses
    };
  } catch (error) {
    console.error("Error submitting responses:", error);
    return { success: false, error: "Failed to submit responses" };
  }
}




