"use server"

import { prisma } from '@/lib/initPrisma';
import { auth } from '@clerk/nextjs/server';

export interface SubmittedResponse {
  responseId: string;
  assessmentItemId: string;
  question: string;
  givenAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

export interface SubmissionResult {
  assessmentId: string;
  assessmentTitle: string;
  classTitle: string;
  classId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  responses: SubmittedResponse[];
  submitterName: string;
  feedback: string | null; // New field for feedback
}

export async function getSubmissionResults(submissionId: string): Promise<SubmissionResult | null> {
  const { userId } = auth();
  
  if (!userId) {
    return null;
  }

  try {
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        assessment: { 
          include: { 
            class: {
              include: {
                taughtBy: {
                  where: { id: userId },
                  select: { id: true },
                },
              },
            },
          } 
        },
        responses: {
          include: {
            assessmentItem: true,
            givenAnswer: true,
          },
        },
        user: true,
      },
    });

    // If the submission does not exist, return null
    if (!submission) {
      return null;
    }

    // Check if the user is neither teaching the class of the assessment
    // nor the submitter of the submission
    const isTeacher = submission.assessment.class.taughtBy.length > 0;
    const isSubmitter = submission.user.id === userId;

    // If the user is not authorised to view the results, return null
    if (!isTeacher && !isSubmitter) {
      console.error('User is not authorised to view these results');
      return null;
    }

    const result: SubmissionResult = {
      assessmentId: submission.assessment.id,
      assessmentTitle: submission.assessment.title,
      classTitle: submission.assessment.class.title,
      classId: submission.assessment.class.id,
      score: submission.score || 0,
      totalQuestions: submission.responses.length,
      correctAnswers: 0,
      responses: [],
      submitterName: submission.user.name,
      feedback: submission.feedback || null,
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

      const resultResponse: SubmittedResponse = {
        responseId: response.id,
        assessmentItemId: response.assessmentItem.id,
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