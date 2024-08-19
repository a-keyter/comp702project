"use server";

import { NotificationType } from "@prisma/client";
import { prisma } from "../initPrisma";

export async function newJoinRequestRejectedNotification(
  classId: string,
  senderId: string,
  recipientId: string
) {
  try {
    const newNotification = await prisma.notification.create({
      data: {
        type: NotificationType.CLASS_JOIN_REJECTED,
        class: { connect: { id: classId } },
        sender: { connect: { id: senderId } },
        recipient: { connect: { id: recipientId } },
      },
    });

    return { success: true, notification: newNotification };
  } catch (error) {
    console.error("Failed to create join request rejected notification:", error);
    return { success: false, error: "Failed to create notification" };
  }
}