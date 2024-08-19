"use server";

import { NotificationType } from "@prisma/client";
import { prisma } from "../initPrisma";

export async function newAssessmentNotification(
  assessmentId: string,
  classId: string,
  senderId: string,
  recipientId: string
) {
  try {
    const newNotification = await prisma.notification.create({
      data: {
        type: NotificationType.NEW_ASSESSMENT,
        assessment: { connect: { id: assessmentId } },
        class: {connect: {id: classId} },
        sender: { connect: { id: senderId } },
        recipient: { connect: { id: recipientId } },
      },
    });

    return { success: true, notification: newNotification };
  } catch (error) {
    console.error("Failed to create new assessment notification:", error);
    return { success: false, error: "Failed to create notification" };
  }
}