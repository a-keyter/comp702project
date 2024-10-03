"use server";

import { upsertTeacherFeedback } from "./upsertTeacherFeedback";
import { generateTeacherFeedback } from "../langchainGenerations/generateTeacherFeedback";
import { fetchAssessmentPerformanceData } from "./assessmentPerformance";

export async function createTeacherFeedback({
  assessmentId,
  averageScore,
  submissionCount,
  membersCount,
}: {
  assessmentId: string;
  averageScore: number;
  submissionCount: number;
  membersCount: number;
}) {
  try {
    // Fetch Assessment Performance Data
    const assessmentResults = await fetchAssessmentPerformanceData({
      assessmentId,
    });

    // Extend the assessment results object with submissions count and average score:
    const extendedAssessmentResults = {
      ...assessmentResults,
      submissionsCount: `${submissionCount} of ${membersCount}`,
      averageScore: averageScore,
    };

    // Make the model call based on the extended data
    const resultsAnalysis = await generateTeacherFeedback(
      extendedAssessmentResults
    );

    // If successful, upsert the teacher feedback
    if (resultsAnalysis) {
      await upsertTeacherFeedback({
        assessmentId,
        content: resultsAnalysis,
        submissionCount,
        lastSubmissionId: assessmentResults.lastSubmission,
      });

      return resultsAnalysis;
    } else {
      throw new Error("Failed to generate teacher feedback");
    }
  } catch (error) {
    console.error("Error in createTeacherFeedback:", error);
    throw error; // Re-throw the error for the caller to handle
  }
}
