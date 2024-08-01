// @/lib/assessmentUtils/getAssessmentResults.ts
"use server"
import { prisma } from '@/lib/initPrisma'; // Adjust this import based on your Prisma client setup
import { auth } from '@clerk/nextjs/server';

export interface ResultResponse {
  id: string;
  question: string;
  givenAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

export interface AssessmentResult {
  assessmentTitle: string;
  classTitle: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  responses: ResultResponse[];
}

export async function getAssessmentResults(submissionId: string): Promise<AssessmentResult | null> {

  try {
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        assessment: { include: { class: true } },
        responses: {
          include: {
            assessmentItem: true,
            givenAnswer: true,
          },
        },
      },
    });

    if (!submission) {
      return null;
    }

    const result: AssessmentResult = {
      assessmentTitle: submission.assessment.title,
      classTitle: submission.assessment.class.title,
      score: submission.score || 0,
      totalQuestions: submission.responses.length,
      correctAnswers: 0,
      responses: [],
    };

    for (const response of submission.responses) {
      const correctAnswer = await prisma.answer.findFirst({
        where: {
          assessmentItemId: response.assessmentItemId,
          isCorrect: true,
        },
      });

      if (!correctAnswer) {
        throw new Error(`No correct answer found for assessment item ${response.assessmentItemId}`);
      }

      const resultResponse: ResultResponse = {
        id: response.id,
        question: response.assessmentItem.content,
        givenAnswer: response.givenAnswer.content,
        correctAnswer: correctAnswer.content,
        isCorrect: response.isCorrect,
      };

      result.responses.push(resultResponse);

      if (response.isCorrect) {
        result.correctAnswers += 1;
      }
    }

    return result;
  } catch (error) {
    console.error('Error fetching assessment results:', error);
    return null;
  }
}