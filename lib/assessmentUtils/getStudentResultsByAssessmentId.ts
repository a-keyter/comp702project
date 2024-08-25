import { prisma } from "@/lib/initPrisma";
import { auth } from "@clerk/nextjs/server";
import { getUserById } from "../userUtils/getUserDetails";
import { ResponseWithUser } from "@/components/submissionsTable/columns";

export async function getStudentResultsByAssessmentId(
  assessmentId: string
): Promise<ResponseWithUser[] | null> {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  try {
    const user = await getUserById(userId);

    if (!user) {
      console.error("User not found");
      return null;
    }

    // Get all submissions for this user and assessment
    const submissions = await prisma.submission.findMany({
      where: {
        assessmentId: assessmentId,
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    
    });

    // Get the total attempt count
    const totalAttempts = submissions.length;

    // Transform the submissions to include user information and attempt count
    const submissionsWithUser: ResponseWithUser[] = submissions.map(
      (submission, index) => ({
        id: submission.id,
        createdAt: submission.createdAt,
        score: submission.score,
        feedback: submission.feedback,
        username: user.name,
        usernickname: user.nickname,
        attemptCount: totalAttempts - index, // This gives the attempt number in descending order
      })
    );

    return submissionsWithUser;
  } catch (error) {
    console.error("Error fetching student results:", error);
    return null;
  }
}
