"use server";

import { NotificationType } from "@prisma/client";
import { prisma } from "../initPrisma";

export async function deleteJoinRequestNotifications(issueId: string) {
  try {
    const deletedNotifications = await prisma.notification.deleteMany({
      where: {
        issueId: issueId,
        type: NotificationType.CLASS_JOIN_REQUEST,
      },
    });

    return { success: true, count: deletedNotifications.count };
  } catch (error) {
    console.error("Failed to delete join request notifications:", error);
    return { success: false, error: "Failed to delete notifications" };
  }
}