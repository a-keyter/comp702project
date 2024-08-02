import { ResponseWithUser } from "@/components/submissionsTable/columns";
import { prisma } from "@/lib/initPrisma";

export async function getResultsByAssessmentId(
  assessmentId: string
): Promise<ResponseWithUser[] | null> {
  try {
    // First, get the most recent submission for each user
    const latestSubmissions = await prisma.submission.findMany({
      where: {
        assessmentId: assessmentId,
      },
      orderBy: {
        createdAt: "desc",
      },
      distinct: ["userId"],
      include: {
        user: {
          select: {
            name: true,
            nickname: true,
          },
        },
      },
    });

    // Then, get the attempt count and highest score for each user
    const userStats = await prisma.submission.groupBy({
      by: ["userId"],
      where: {
        assessmentId: assessmentId,
      },
      _count: {
        id: true,
      },
      _max: {
        score: true,
      },
    });

    // Combine the latest submissions with the attempt counts and highest scores
    const submissionsWithStats: ResponseWithUser[] = latestSubmissions.map(
      (submission) => {
        const stats = userStats.find(
          (stat) => stat.userId === submission.userId
        );
        return {
          id: submission.id,
          createdAt: submission.createdAt,
          score: stats ? stats._max.score : submission.score,
          user: submission.user,
          attemptCount: stats ? stats._count.id : 1,
        };
      }
    );

    return submissionsWithStats;
  } catch (error) {
    console.error("Error fetching results:", error);
    return null;
  }
}
