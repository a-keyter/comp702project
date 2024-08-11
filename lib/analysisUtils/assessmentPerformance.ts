import { prisma } from "../initPrisma";

export interface QuestionStatistics {
  assessmentItemId: string;
  question: string;
  responseAccuracy: number;
}

export async function fetchQuestionStats(assessmentId: string): Promise<QuestionStatistics[]> {
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
          include: {
            assessmentItem: {
              select: {
                id: true,
                content: true,
              },
            },
          },
        },
      },
    });

    const questionStats: Map<string, QuestionStatistics> = new Map();

    submissions.forEach(submission => {
      submission.responses.forEach(response => {
        const { id: assessmentItemId, content: question } = response.assessmentItem;
        
        if (!questionStats.has(assessmentItemId)) {
          questionStats.set(assessmentItemId, {
            assessmentItemId,
            question,
            responseAccuracy: 0,
          });
        }

        const stats = questionStats.get(assessmentItemId)!;
        const totalResponses = (stats.responseAccuracy * questionStats.size) || 0;
        const newTotalResponses = totalResponses + 1;
        const newCorrectResponses = response.isCorrect ? 
          (totalResponses * stats.responseAccuracy) + 1 : 
          (totalResponses * stats.responseAccuracy);
        
        stats.responseAccuracy = newCorrectResponses / newTotalResponses;
      });
    });

    return Array.from(questionStats.values())
  } catch (error) {
    console.error('Error fetching question stats:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}