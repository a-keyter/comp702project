import { prisma } from "@/lib/initPrisma";
import { auth } from "@clerk/nextjs/server";
import { getUserById } from "../userUtils/getUserDetails";
import { ResponseWithUser } from "@/components/submissionsTable/columns";

export async function getStudentResultsByAssessmentId(assessmentId: string): Promise<ResponseWithUser[] | null> {
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

    const submissions = await prisma.submission.findMany({
      where: {
        assessmentId: assessmentId,
        userId: userId,
      },
      select: {
        id: true,
        createdAt: true,
        score: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform the submissions to include user information
    const submissionsWithUser: ResponseWithUser[] = submissions.map(submission => ({
      ...submission,
      user: {
        name: user.name,
        nickname: user.nickname,
      }
    }));

    return submissionsWithUser;
  } catch (error) {
    console.error("Error fetching student results:", error);
    return null;
  }
}