import { ResponseWithUser } from "@/components/submissionsTable/columns";
import { prisma } from "@/lib/initPrisma";

export async function getResultsByAssessmentId(
  assessmentId: string
): Promise<ResponseWithUser[] | null> {
  try {
    // Get the most recent submission for each user
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

    // Get the attempt count for each user
    const userStats = await prisma.submission.groupBy({
      by: ["userId"],
      where: {
        assessmentId: assessmentId,
      },
      _count: {
        id: true,
      },
    });

    // Combine the latest submissions with the attempt counts
    const submissionsWithStats: ResponseWithUser[] = latestSubmissions.map(
      (submission) => {
        const stats = userStats.find(
          (stat) => stat.userId === submission.userId
        );
        return {
          id: submission.id,
          createdAt: submission.createdAt,
          score: submission.score, // Use the score from the latest submission
          feedback: submission.feedback,
          username: submission.user.name,
          usernickname: submission.user.nickname,
          attemptCount: stats ? stats._count.id : 1, 
          // Return the number of attempts for this user, or 1 if no attempts found
          // The attemptCount represents how many times the user has submitted this assessment.
          // If stats exist for the user, we return the count of their submissions.
          // If no stats are found (which shouldn't happen normally), we default to 1 attempt.
        };
      }
    );

    return submissionsWithStats;
  } catch (error) {
    console.error("Error fetching results:", error);
    return null;
  }
}