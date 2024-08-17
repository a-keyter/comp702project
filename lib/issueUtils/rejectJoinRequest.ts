"use server"

import { auth } from "@clerk/nextjs/server";
import { prisma } from "../initPrisma";

export async function rejectJoinRequest(issueId: string) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    // Fetch the issue to ensure it exists and is of the correct type
    const issue = await prisma.issue.findUnique({
      where: { id: issueId },
    });

    if (!issue) {
      throw new Error("Issue not found");
    }

    if (issue.type !== "CLASS_JOIN_REQUEST") {
      throw new Error("Invalid issue type");
    }

    // Update the issue
    const updatedIssue = await prisma.issue.update({
      where: { id: issueId },
      data: {
        status: "REJECTED",
        lastUpdatedBy: {
          connect: { id: userId },
        },
      },
    });

    return { success: true, issue: updatedIssue };
  } catch (error) {
    console.error("Error rejecting join request:", error);
    throw error;
  }
}