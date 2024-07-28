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