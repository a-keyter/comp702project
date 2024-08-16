"use server"

import { prisma } from "../initPrisma";

interface TeacherFeedback {
    id: string;
    content: string;
    submissionCount: number;
    lastSubmissionId: string;
    createdAt: Date;
  }

export async function getTeacherFeedback(assignmentId: string): Promise<TeacherFeedback | null> {
    try {
      const feedback = await prisma.teacherFeedback.findUnique({
        where: {
          assessmentId: assignmentId,
        },
      });
  
      if (feedback) {
        // console.log('Teacher feedback found for assignment:', assignmentId);
        // console.log("Last submission ID: " + feedback.lastSubmissionId)
        // console.log("Feedback ID: " + feedback.id)
        return feedback;
      } else {
        // console.log('No teacher feedback found for assignment:', assignmentId);
        return null;
      }
    } catch (error) {
      console.error('Error checking teacher feedback:', error);
      throw error; // Re-throw the error for the caller to handle
    } finally {
      await prisma.$disconnect();
    }
  }