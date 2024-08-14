"use server"

import { prisma } from "../initPrisma";

export interface QuestionStatistics {
  assessmentItemId: string;
  question: string;
  correctResponses: number;
  incorrectResponses: number;
  questionNumber: string;
}

export async function fetchOriginalQuestionStats(assessmentId: string) {
  try {
    const submissions = await prisma.submission.findMany({
      where: {
        assessmentId: assessmentId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      distinct: ['userId'],
      include: {
        responses: {
          orderBy: {
            assessmentItem: {
              index: 'asc',
            },
          },
          include: {
            assessmentItem: {
              select: {
                id: true,
                content: true,
                index: true,
              },
            },
          },
        },
      },
    });

    // Initialize a map to store statistics for each question
    const questionStats: Map<string, QuestionStatistics> = new Map();

    let questionCounter = 1;

    // Process all submissions to calculate statistics
    submissions.forEach(submission => {
      submission.responses.forEach(response => {
        const assessmentItemId = response.assessmentItem.id;
        const question = response.assessmentItem.content;
        
        if (!questionStats.has(assessmentItemId)) {
          questionStats.set(assessmentItemId, {
            assessmentItemId,
            question,
            correctResponses: 0,
            incorrectResponses: 0,
            questionNumber: `Q${questionCounter}`,
          });
          questionCounter++;
        }

        const stats = questionStats.get(assessmentItemId)!;
        if (response.isCorrect) {
          stats.correctResponses++;
        } else {
          stats.incorrectResponses++;
        }
      });
    });

    // Convert the map to an array, maintaining the order of insertion
    const sortedStats = Array.from(questionStats.values());

    return {
      questionStats: sortedStats,
    };
  } catch (error) {
    console.error('Error fetching submissions and question stats:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}