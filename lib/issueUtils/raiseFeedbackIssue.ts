"use server"

import { auth } from "@clerk/nextjs/server";
import { IssueType, IssueStatus } from "@prisma/client"; // Import the enums from Prisma client
import { prisma } from "../initPrisma";

type RequestOutcome = {
  outcome: "success" | "error";
  message: string;
};

export async function raiseFeedbackIssue(submissionId: string, feedback: string, issueDescription: string): Promise<RequestOutcome> {
  // Fetch the current user ID using Clerk auth
  const { userId } = auth();

  if (!userId) {
    return {
      outcome: "error",
      message: "Error raising feedback issue: User not authenticated."
    };
  }

  try {
    // Find the submission by submissionId
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: { assessment: { include: { class: true } } }
    });

    if (!submission) {
      return {
        outcome: "error",
        message: "Error raising feedback issue: Submission not found."
      };
    }

    // Check if the user is authorized to raise an issue for this submission
    if (submission.userId !== userId) {
      return {
        outcome: "error",
        message: "Error raising feedback issue: You are not authorized to raise an issue for this submission."
      };
    }

    // Check if a non-resolved feedback issue already exists for this submission
    const existingIssue = await prisma.issue.findFirst({
      where: {
        type: IssueType.FEEDBACK_ISSUE,
        submissionId: submissionId,
        raisedById: userId,
        status: {
          not: IssueStatus.RESOLVED
        }
      }
    });

    if (existingIssue) {
      return {
        outcome: "error",
        message: "Error raising feedback issue: An open issue already exists for this submission."
      };
    }

    // Create the issue
    const newIssue = await prisma.issue.create({
      data: {
        type: IssueType.FEEDBACK_ISSUE,
        status: IssueStatus.UNREAD,
        raisedBy: { connect: { id: userId } },
        lastUpdatedBy: { connect: { id: userId } },
        relevantClass: { connect: { id: submission.assessment.classId } },
        relevantAssessment: { connect: {id: submission.assessmentId}},
        submission: { connect: { id: submissionId } },
        feedback: feedback
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
      message: "Feedback issue successfully raised. A teacher will review it soon."
    };

  } catch (error) {
    console.error("Error raising feedback issue:", error);
    return {
      outcome: "error",
      message: "Error raising feedback issue: An unexpected error occurred."
    };
  }
}