import { prisma } from "../initPrisma";

interface UpsertTeacherFeedbackParams {
  assessmentId: string;
  content: string;
  submissionCount: number;
  lastSubmissionId: string | undefined; 
}

export async function upsertTeacherFeedback({
  assessmentId,
  content,
  submissionCount,
  lastSubmissionId
}: UpsertTeacherFeedbackParams): Promise<void> {
  if (!lastSubmissionId) {
    throw new Error("lastSubmissionId is required and cannot be undefined or empty");
  }

  try {
    await prisma.teacherFeedback.upsert({
      where: {
        assessmentId: assessmentId,
      },
      update: {
        content: content,
        submissionCount: submissionCount,
        lastSubmissionId: lastSubmissionId,
        createdAt: new Date(), // Update the createdAt time
      },
      create: {
        content: content,
        assessmentId: assessmentId,
        submissionCount: submissionCount,
        lastSubmissionId: lastSubmissionId,
        // No need to specify createdAt here as it defaults to now()
      },
    });

    console.log('Teacher feedback upserted successfully');
  } catch (error) {
    console.error('Error upserting teacher feedback:', error);
    throw error; // Re-throw the error for the caller to handle
  } finally {
    await prisma.$disconnect();
  }
}