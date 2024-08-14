"use server"

import { prisma } from "../initPrisma";
import { generateStudentFeedback } from "../langchainGenerations/generateFeedback";
import { IncorrectResponse } from "./submitResponses";


export async function finaliseSubmission(
    submissionId: string, 
    assessmentTitle: string, 
    assessmentObjectives: string,
    totalResponses: number,
    correctResponses: number,
    incorrectResponses: IncorrectResponse[]
  ) {
    try {
      const score = (correctResponses / totalResponses) * 100;
  
      await prisma.submission.update({
        where: { id: submissionId },
        data: { score },
      });
  
      // Generate feedback
      const feedbackContent = await generateStudentFeedback({
        assessmentTitle,
        assessmentObjectives,
        incorrectResponses,
      });
  
      await prisma.submission.update({
        where: { id: submissionId },
        data: { feedback: feedbackContent },
      });
  
      return { success: true, score };
    } catch (error) {
      console.error("Error finalizing submission:", error);
      return { success: false, error: "Failed to finalize submission" };
    }
  }