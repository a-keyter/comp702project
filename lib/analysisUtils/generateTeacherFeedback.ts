"use server"

import TeacherFeedback, { TeacherFeedbackDetails } from "@/components/assessmentStatistics/GroupFeedback";
import { prisma } from "../initPrisma";
import { generateTeacherFeedback } from "../langchainGenerations/generateFeedback";
import { upsertTeacherFeedback } from "./upsertTeacherFeedback";

async function fetchAssessmentPerformanceData({
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
    // First fetch a list of the latest submissions and the answers to each question
    const latestSubmissionsData = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: {
        submissions: {
          distinct: ["userId"],
          orderBy: { createdAt: "desc" },
          take: 1,
          include: {
            responses: true,
          },
        },
        assessmentItems: {
          orderBy: { index: "asc" },
          where: { type: "MCQ" },
          include: { answers: true },
        },
      },
    });

    // Then we can fetch the results data for each question
    const questionResponseBreakdown =
      latestSubmissionsData?.assessmentItems.map((item) => {
        const correctAnswer = item.answers.find((answer) => answer.isCorrect);
        const incorrectAnswers = item.answers.filter(
          (answer) => !answer.isCorrect
        );

        // Calculate percent correct and incorrect answer distributions
        const totalResponses = latestSubmissionsData.submissions.length;
        const correctResponses = latestSubmissionsData.submissions.filter(
          (submission) =>
            submission.responses.some(
              (response) =>
                response.givenAnswerId === correctAnswer?.id &&
                response.assessmentItemId === item.id
            )
        ).length;

        const percentCorrect = (
          (correctResponses / totalResponses) *
          100
        ).toFixed(2);

        const incorrectAnswerDistribution: Record<string, string> = {};
        incorrectAnswers.forEach((answer) => {
          const answerCount = latestSubmissionsData.submissions.filter(
            (submission) =>
              submission.responses.some(
                (response) =>
                  response.givenAnswerId === answer.id &&
                  response.assessmentItemId === item.id
              )
          ).length;
          incorrectAnswerDistribution[answer.content] = (
            (answerCount / totalResponses) *
            100
          ).toFixed(2);
        });

        return {
          questionId: item.id,
          question: item.content,
          correct_answer: correctAnswer ? correctAnswer.content : "",
          percent_correct: percentCorrect,
          incorrect_answers: incorrectAnswerDistribution,
        };
      });

    // Finally, we create our return object
    return {
      assessmentTitle: latestSubmissionsData?.title,
      assessmentObjectives: latestSubmissionsData?.objectives,
      averageScore: averageScore,
      lastSubmission: latestSubmissionsData?.submissions[0].id,
      submissionsCount: `${submissionCount} of ${membersCount}`,
      questions: questionResponseBreakdown,
    };
  } catch (error) {
    console.error("Error fetching class performance data:", error);
    throw error;
  }
}

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
      averageScore, 
      submissionCount, 
      membersCount
    });

    // Make the model call based on the data
    const resultsAnalysis = await generateTeacherFeedback(assessmentResults);

    // If successful, upsert the teacher feedback
    if (resultsAnalysis) {
      await upsertTeacherFeedback({
        assessmentId,
        content: resultsAnalysis,
        submissionCount,
        lastSubmissionId: assessmentResults.lastSubmission // Assuming the last submission is the latest
      });

      console.log('Teacher feedback created and saved successfully');
      return resultsAnalysis;
    } else {
      throw new Error('Failed to generate teacher feedback');
    }
  } catch (error) {
    console.error('Error in createTeacherFeedback:', error);
    throw error; // Re-throw the error for the caller to handle
  }
}