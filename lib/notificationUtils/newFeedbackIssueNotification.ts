"use server";

import { NotificationType } from "@prisma/client";
import { prisma } from "../initPrisma";

export async function newFeedbackIssueNotification(
  issueId: string,
  assessmentId: string,
  senderId: string,
  recipientId: string
) {
  try {
    const newNotification = await prisma.notification.create({
      data: {
        type: NotificationType.FEEDBACK_ISSUE_RAISED,
        issue: { connect: { id: issueId } },
        assessment: { connect: { id: assessmentId } },
        sender: { connect: { id: senderId } },
        recipient: { connect: { id: recipientId } },
      },
    });

    return { success: true, notification: newNotification };
  } catch (error) {
    console.error("Failed to create feedback issue notification:", error);
    return { success: false, error: "Failed to create notification" };
  }
}