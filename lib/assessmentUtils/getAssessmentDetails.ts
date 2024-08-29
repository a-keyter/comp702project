"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "../initPrisma";
import { redirect } from "next/navigation";

export async function getAssessmentById(id: string) {
  const { userId } = auth();

  if (!userId) {
    redirect('/'); // Redirect to login if no user is authenticated
  }

  try {
    const assessment = await prisma.assessment.findUnique({
      where: { id },
      include: {
        createdBy: true,
        class: {
          include: {
            _count: {
              select: { members: true },
            },
            taughtBy: {
              where: { id: userId },
              select: { id: true },
            },
            members: {
              where: { id: userId },
              select: { id: true },
            },
          },
        },
        assessmentItems: true,
        submissions: {
          orderBy: {
            createdAt: "desc",
          },
          select: {
            id: true,
            score: true,
            feedback: true,
          },
        },
        teacherFeedback: {
          select: {
            content: true,
            lastSubmissionId: true,
          },
        },
      },
    });

    if (!assessment) {
      return null;
    }

    if (assessment.class.taughtBy.length === 0 && assessment.class.members.length === 0) {
      redirect('/dashboard'); // Redirect to dashboard if user doesn't have access to assessment.
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
  const currentDate = new Date()
  const { userId } = auth();
  if (!userId) {
    return null;
  }
  try {
    const assessments = await prisma.assessment.findMany({
      where: {
        class: {
          taughtBy: {
            some: {
              id: userId,
            },
          },
        },
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
        dueDate: "asc",
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

export async function getUpcomingTeacherAssessmentData() {
  const currentDate = new Date()
  const { userId } = auth();
  if (!userId) {
    return null;
  }
  try {
    const assessments = await prisma.assessment.findMany({
      where: {
        dueDate: {gt: currentDate },
        class: {
          taughtBy: {
            some: {
              id: userId,
            },
          },
        },
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
        dueDate: "asc",
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

export async function getClassAssessmentsTeacher(classId: string) {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  try {
    const assessments = await prisma.assessment.findMany({
      where: {
        class: { taughtBy: { some: { id: userId } } },
        classId: classId, // Filter by classId
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
        dueDate: "asc",
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
    console.error("Error fetching class assessments data:", error);
    throw error;
  }
}

export async function getLiveClassAssessmentsTeacher(classId: string) {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  try {
    const assessments = await prisma.assessment.findMany({
      where: {
        class: { taughtBy: { some: { id: userId } } },
        classId: classId, // Filter by classId
        status: "LIVE",
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
        dueDate: "asc",
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
    console.error("Error fetching class assessments data:", error);
    throw error;
  }
}

export async function getStudentAssessmentData() {
  const { userId } = auth();
  if (!userId) {
    return null;
  }
  try {
    const currentDate = new Date()
    const assessments = await prisma.assessment.findMany({
      where: {
        class: { members: { some: { id: userId } } },
        status: "LIVE",
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
        dueDate: "asc",
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

export async function getUpcomingStudentAssessmentData() {
  const { userId } = auth();
  if (!userId) {
    return null;
  }
  try {
    const currentDate = new Date()
    const assessments = await prisma.assessment.findMany({
      where: {
        class: { members: { some: { id: userId } } },
        status: "LIVE",
        dueDate: {gt: currentDate}
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
        dueDate: "asc",
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

export async function getClassAssessmentsStudent(classId: string) {
  const { userId } = auth();

  if (!userId) {
    return null;
  }
  try {
    const assessments = await prisma.assessment.findMany({
      where: {
        classId: classId,
        class: { members: { some: { id: userId } } },
        status: "LIVE",
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
        dueDate: "asc",
      },
    });

    const assessmentsWithAttempts = assessments.map((assessment) => ({
      ...assessment,
      attempts: assessment._count.submissions,
      _count: undefined,
    }));

    return assessmentsWithAttempts;
  } catch (error) {
    console.error("Error fetching class assessments for student:", error);
    return null;
  }
}
