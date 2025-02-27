"use server";

import { prisma } from "@/lib/initPrisma";

export async function getAssessmentsByNicknameAndClass(
  nickname: string,
  classId: string
) {
  try {
    const user = await prisma.user.findUnique({
      where: { nickname },
      select: { id: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Fetch all live assessments for the class
    const liveAssessments = await prisma.assessment.findMany({
      where: {
        classId: classId,
        status: "LIVE",
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        dueDate: true,
      },
      orderBy: { dueDate: "asc" },
    });

    // Fetch the latest submissions for each assessment
    const latestSubmissions = await prisma.submission.findMany({
      where: {
        userId: user.id,
        assessmentId: { in: liveAssessments.map((a) => a.id) },
      },
      orderBy: { createdAt: "desc" },
      distinct: ["assessmentId"],
      select: {
        assessmentId: true,
        score: true,
        createdAt: true,
      },
    });

    // Create a map of assessment ID to submission for quick lookup
    const submissionMap = new Map(
      latestSubmissions.map((s) => [s.assessmentId, s])
    );

    // Combine assessment and submission data
    const assessmentData = liveAssessments.map((assessment) => {
      const submission = submissionMap.get(assessment.id);
      
      return {
        assessmentId: assessment.id,
        assessmentTitle: assessment.title,
        latestScore: submission?.score ?? 0,
        submissionDate: submission?.createdAt?.toLocaleDateString() ?? null,
        dueDate: assessment.dueDate,
        status: submission ? "Submitted" : "Not submitted",
      };
    });

    return assessmentData;
  } catch (error) {
    console.error("Error fetching assessment data:", error);
    throw error;
  }
}