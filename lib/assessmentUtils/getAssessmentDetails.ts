"use server"

import { auth } from "@clerk/nextjs/server";
import { prisma } from "../initPrisma";

export async function getAssessmentById(id: string) {
  try {
    const assessment = await prisma.assessment.findUnique({
      where: { id },
      include: {
        createdBy: true,
        class: true,
        assessmentItems: true,
        submissions: {
            select: {
              score: true,
            },
      },
    }
  });

    if (!assessment) {
      return null;
    }

    return {
      ...assessment,
      createdAt: assessment.createdAt.toISOString(),
      updatedAt: assessment.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error("Error fetching assessment:", error);
    return null;
  }
}


export async function getUserAssessments() {
  const { userId } = auth();
  
  if (!userId) {
    return null;
  }

  try {
    const assessments = await prisma.assessment.findMany({
      where: {
        createdById: userId
      },
      include: {
        submissions: {
          select: {
            score: true,
          },
        },
        class: {
          select: {
            id: true,
            title: true,
          },
        },
        assessmentItems: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    const assessmentsWithStats = assessments.map(assessment => {
      const submissionCount = assessment.submissions.length;
      let averageScore: number | string = 'N/A';
      if (submissionCount > 0) {
        const totalScore = assessment.submissions.reduce((sum, sub) => sum + (sub.score || 0), 0);
        averageScore = (totalScore / submissionCount).toFixed(2);
      }

      return {
        ...assessment,
        submissionCount,
        averageScore,
        // Remove the submissions field as it's not needed in the final output
        submissions: undefined,
      };
    });

    return assessmentsWithStats;

  } catch (error) {
    console.error("Error fetching user assessments:", error);
    return null;
  }
}


export async function getClassAssessments(classId: string) {
  const { userId } = auth();
  
  if (!userId) {
    return null;
  }

  try {
    // First, check if the user is a member of the class or created it
    const userClass = await prisma.class.findFirst({
      where: {
        id: classId,
        OR: [
          { createdById: userId },
          { members: { some: { id: userId } } }
        ]
      }
    });

    if (!userClass) {
      // User is neither a member nor the creator of the class
      return null;
    }

    // If the user has access to the class, proceed with fetching assessments
    const assessments = await prisma.assessment.findMany({
      where: {
        classId: classId
      },
      include: {
        submissions: {
          select: {
            score: true,
          },
        },
        class: {
          select: {
            id: true,
            title: true,
          },
        },
        assessmentItems: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    const assessmentsWithStats = assessments.map(assessment => {
      const submissionCount = assessment.submissions.length;
      let averageScore: number | string = 'N/A';
      if (submissionCount > 0) {
        const totalScore = assessment.submissions.reduce((sum, sub) => sum + (sub.score || 0), 0);
        averageScore = (totalScore / submissionCount).toFixed(2);
      }

      return {
        ...assessment,
        submissionCount,
        averageScore,
        submissions: undefined,
      };
    });

    return assessmentsWithStats;

  } catch (error) {
    console.error("Error fetching user assessments:", error);
    return null;
  }
}