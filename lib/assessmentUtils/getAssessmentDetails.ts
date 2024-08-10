"use server";

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
            id: true,
            score: true,
            feedback: true,
          },
        },
      },
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

export async function getTeacherAssessmentData() {
  const { userId } = auth();
  if (!userId) {
    return null;
  }
  try {
    const assessments = await prisma.assessment.findMany({
      where: {
        createdById: userId,
      },
      include: {
        submissions: {
          orderBy: {
            createdAt: "desc",
          },
          select: {
            userId: true,
            score: true,
          },
        },
        class: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    const assessmentsWithStats = assessments.map((assessment) => {
      const uniqueUserSubmissions = new Map();
      
      // Get the most recent submission for each unique user
      assessment.submissions.forEach((submission) => {
        if (!uniqueUserSubmissions.has(submission.userId)) {
          uniqueUserSubmissions.set(submission.userId, submission.score);
        }
      });

      const submissionCount = uniqueUserSubmissions.size;
      let averageScore: number | string = "N/A";

      if (submissionCount > 0) {
        const totalScore = Array.from(uniqueUserSubmissions.values()).reduce(
          (sum, score) => sum + (score || 0),
          0
        );
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
    console.error("Error fetching teacher assessment data:", error);
    throw error;
  }
}

export async function getStudentAssessmentData() {
  const { userId } = auth();
  if (!userId) {
    return null;
  }
  try {
    const assessments = await prisma.assessment.findMany({
      where: {
        class: { members: { some: { id: userId } } },
      },
      include: {
        submissions: {
          where: {
            userId: userId,
          },
          orderBy: {
            createdAt: "desc",
          },
          select: {
            id: true,
            score: true,
            createdAt: true,
          },
        },
        class: {
          select: {
            id: true,
            title: true,
          },
        },
        _count: {
          select: { submissions: { where: { userId: userId } } },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    const assessmentsWithAttempts = assessments.map((assessment) => ({
      ...assessment,
      attempts: assessment._count.submissions,
      _count: undefined,
    }));

    return assessmentsWithAttempts;
  } catch (error) {
    console.error("Error fetching student assessments:", error);
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
        OR: [{ createdById: userId }, { members: { some: { id: userId } } }],
      },
    });

    if (!userClass) {
      // User is neither a member nor the creator of the class
      return null;
    }

    // If the user has access to the class and is teacher, proceed with fetching assessments
    const assessments = await prisma.assessment.findMany({
      where: {
        classId: classId,
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
        updatedAt: "desc",
      },
    });

    const assessmentsWithStats = assessments.map((assessment) => {
      const submissionCount = assessment.submissions.length;
      let averageScore: number | string = "N/A";
      if (submissionCount > 0) {
        const totalScore = assessment.submissions.reduce(
          (sum, sub) => sum + (sub.score || 0),
          0
        );
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
