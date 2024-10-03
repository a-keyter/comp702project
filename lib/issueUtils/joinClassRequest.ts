"use server";

import { auth } from "@clerk/nextjs/server";
import { IssueType, IssueStatus } from "@prisma/client"; // Import the enums from Prisma client
import { prisma } from "../initPrisma";
import { newJoinRequestNotification } from "../notificationUtils/newJoinRequestNotification";

type RequestOutcome = {
  outcome: "success" | "error";
  message: string;
};

export async function joinClassRequest(
  classId: string
): Promise<RequestOutcome> {
  // Fetch the current user ID using Clerk auth
  const { userId } = auth();

  if (!userId) {
    return {
      outcome: "error",
      message: "Error creating join class request: User not authenticated.",
    };
  }

  try {
    // Find the class by classId
    const relevantClass = await prisma.class.findUnique({
      where: { id: classId },
      include: { taughtBy: true },
    });

    if (!relevantClass) {
      return {
        outcome: "error",
        message: "Error creating join class request: Class not found.",
      };
    }

    // Check if a non-rejected join request already exists
    const existingRequest = await prisma.issue.findFirst({
      where: {
        type: IssueType.CLASS_JOIN_REQUEST,
        relevantClassId: classId,
        raisedById: userId,
        status: {
          not: IssueStatus.REJECTED,
        },
      },
    });

    if (existingRequest) {
      return {
        outcome: "error",
        message:
          "Error creating join class request: Request already in progress.",
      };
    }

    // Create the join class request issue
    const issue = await prisma.issue.create({
      data: {
        type: IssueType.CLASS_JOIN_REQUEST,
        status: IssueStatus.UNREAD,
        raisedBy: { connect: { id: userId } },
        lastUpdatedBy: { connect: { id: userId } },
        relevantClass: { connect: { id: classId } },
      },
    });

    await Promise.all(relevantClass.taughtBy.map(teacher => 
      newJoinRequestNotification(issue.id, classId, userId, teacher.id)
    ));

    return {
      outcome: "success",
      message:
        "Request to join class successfully raised. Please await teacher approval.",
    };
  } catch (error) {
    console.error("Error creating join class request:", error);
    return {
      outcome: "error",
      message:
        "Error creating join class request: An unexpected error occurred.",
    };
  }
}
