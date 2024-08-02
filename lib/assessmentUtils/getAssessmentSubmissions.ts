import { ResponseWithUser } from '@/components/submissionsTable/columns';
import { prisma } from '@/lib/initPrisma';

export async function getResultsByAssessmentId(assessmentId: string):Promise<ResponseWithUser[] | null> {
  try {
    const submissions = await prisma.submission.findMany({
      where: {
        assessmentId: assessmentId,
      },
      include: {
        user: {
          select: {
            name: true,
            nickname: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return submissions;
  } catch (error) {
    console.error('Error fetching results:', error);
    return null;
  }
}