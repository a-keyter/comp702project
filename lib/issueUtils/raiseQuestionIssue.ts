"use server"

import { auth } from "@clerk/nextjs/server";
import { IssueType, IssueStatus } from "@prisma/client"; // Import the enums from Prisma client
import { prisma } from "../initPrisma";

type RequestOutcome = {
  outcome: "success" | "error";
  message: string;
};

export async function raiseQuestionIssue(responseId: string, issueDescription: string, question: string, correctAnswer: string, givenAnswer: string): Promise<RequestOutcome> {
  // Fetch the current user ID using Clerk auth
  const { userId } = auth();

  if (!userId) {
    return {
      outcome: "error",
      message: "Error raising question issue: User not authenticated."
    };
  }

  try {
    // Find the response by responseId
    const response = await prisma.response.findUnique({
      where: { id: responseId },
      include: { submission: { include: { assessment: { include: { class: true } } } } }
    });

    if (!response) {
      return {
        outcome: "error",
        message: "Error raising question issue: Response not found."
      };
    }

    // Check if a non-resolved question issue already exists for this response
    const existingIssue = await prisma.issue.findFirst({
      where: {
        type: IssueType.QUESTION_ISSUE,
        assessmentItemId: response.assessmentItemId,
        raisedById: userId,
        status: {
          not: IssueStatus.RESOLVED
        }
      }
    });

    if (existingIssue) {
      return {
        outcome: "error",
        message: "Error raising question issue: An open issue already exists for this question."
      };
    }

    // Create the issue
    const newIssue = await prisma.issue.create({
      data: {
        type: IssueType.QUESTION_ISSUE,
        status: IssueStatus.UNREAD,
        raisedBy: { connect: { id: userId } },
        lastUpdatedBy: { connect: { id: userId } },
        relevantClass: { connect: { id: response.submission.assessment.classId } },
        relevantAssessment: { connect: {id: response.submission.assessmentId}},
        assessmentItem: { connect: { id: response.assessmentItemId } },
        question: question,
        correctAnswer: correctAnswer,
        givenAnswer: givenAnswer,
      },
    });

    await prisma.message.create({
        data: {
          content: issueDescription,
          sender: { connect: { id: userId } },
          issue: { connect: { id: newIssue.id } },
        },
      });

    return {
      outcome: "success",
      message: "Question issue successfully raised. A teacher will review it soon."
    };

  } catch (error) {
    console.error("Error raising question issue:", error);
    return {
      outcome: "error",
      message: "Error raising question issue: An unexpected error occurred."
    };
  }
}