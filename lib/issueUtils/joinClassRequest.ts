"use server"

import { auth } from "@clerk/nextjs/server";
import { IssueType, IssueStatus } from "@prisma/client"; // Import the enums from Prisma client
import { prisma } from "../initPrisma";

type RequestOutcome = {
  outcome: "success" | "error";
  message: string;
};

export async function joinClassRequest(classCode: string): Promise<RequestOutcome> {
  // Fetch the current user ID using Clerk auth
  const { userId } = auth();

  if (!userId) {
    return {
      outcome: "error",
      message: "Error creating join class request: User not authenticated."
    };
  }

  try {
    // Find the class by classCode
    const relevantClass = await prisma.class.findUnique({
      where: { id: classCode },
    });

    if (!relevantClass) {
      return {
        outcome: "error",
        message: "Error creating join class request: Class not found."
      };
    }

    // Check if a non-rejected join request already exists
    const existingRequest = await prisma.issue.findFirst({
      where: {
        type: IssueType.CLASS_JOIN_REQUEST,
        relevantClassId: classCode,
        raisedById: userId,
        status: {
          not: IssueStatus.REJECTED // Assuming RESOLVED status is used for rejected requests
        }
      }
    });

    if (existingRequest) {
      return {
        outcome: "error",
        message: "Error creating join class request: Request already in progress."
      };
    }

    // Create the issue
    await prisma.issue.create({
      data: {
        type: IssueType.CLASS_JOIN_REQUEST,
        status: IssueStatus.UNREAD,
        raisedBy: { connect: { id: userId } },
        lastUpdatedBy: { connect: { id: userId } },
        relevantClass: { connect: { id: classCode } },
      },
    });

    return {
      outcome: "success",
      message: "Request to join class successfully raised. Please await teacher approval."
    };

  } catch (error) {
    console.error("Error creating join class request:", error);
    return {
      outcome: "error",
      message: "Error creating join class request: An unexpected error occurred."
    };
  }
}