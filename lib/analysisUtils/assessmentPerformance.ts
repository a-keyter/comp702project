import { prisma } from "../initPrisma";

interface QuestionStatistics {
  assessmentItemId: string;
  totalResponses: number;
  correctResponses: number;
}

export async function fetchSubmissionsAndQuestionStats(assessmentId: string) {
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
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        responses: {
          include: {
            assessmentItem: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    // Initialize a map to store statistics for each question
    const questionStats: Map<string, QuestionStatistics> = new Map();

    // Process all submissions to calculate statistics
    submissions.forEach(submission => {
      submission.responses.forEach(response => {
        const assessmentItemId = response.assessmentItem.id;
        if (!questionStats.has(assessmentItemId)) {
          questionStats.set(assessmentItemId, {
            assessmentItemId,
            totalResponses: 0,
            correctResponses: 0,
          });
        }

        const stats = questionStats.get(assessmentItemId)!;
        stats.totalResponses++;
        if (response.isCorrect) {
          stats.correctResponses++;
        }
      });
    });

    return {
      submissions,
      questionStats: Array.from(questionStats.values()),
    };
  } catch (error) {
    console.error('Error fetching submissions and question stats:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}