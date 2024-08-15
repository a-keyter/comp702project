"use server";

import { prisma } from "../initPrisma";
import { generateTeacherFeedback } from "../langchainGenerations/generateFeedback";
import { upsertTeacherFeedback } from "./upsertTeacherFeedback";

export async function fetchAssessmentPerformanceData({
  assessmentId,
}: {
  assessmentId: string;
}) {
  try {
    const latestSubmissionsData = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: {
        submissions: {
          orderBy: { createdAt: "desc" },
          distinct: ["userId"],
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

    // console.log("Assessment Items:", latestSubmissionsData?.assessmentItems);
    // console.log("Submissions:", latestSubmissionsData?.submissions);

    const questionResponseBreakdown =
      latestSubmissionsData?.assessmentItems.map((item) => {
        const correctAnswer = item.answers.find((answer) => answer.isCorrect);
        const incorrectAnswers = item.answers.filter(
          (answer) => !answer.isCorrect
        );

        // console.log("Correct Answer for question:", item.id, correctAnswer);

        const totalResponses = latestSubmissionsData.submissions.length;
        const correctResponses = latestSubmissionsData.submissions.filter((submission) => {
          const hasCorrectResponse = submission.responses.some(
            (response) =>
              response.givenAnswerId === correctAnswer?.id &&
              response.assessmentItemId === item.id
          );
          // console.log("Submission:", submission.id, "Has correct response:", hasCorrectResponse);
          return hasCorrectResponse;
        }).length;

        const percentCorrect = totalResponses > 0
          ? ((correctResponses / totalResponses) * 100).toFixed(2)
          : "0.00";

        // console.log("Question:", item.id, "Total responses:", totalResponses, "Correct responses:", correctResponses, "Percent correct:", percentCorrect);

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

    const returnObject = {
      assessmentTitle: latestSubmissionsData?.title,
      assessmentObjectives: latestSubmissionsData?.objectives,
      lastSubmission: latestSubmissionsData?.submissions[0]?.id,
      questions: questionResponseBreakdown,
    };

    // console.log("Return object:", returnObject);

    return returnObject;
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
