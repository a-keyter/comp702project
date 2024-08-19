"use server";

import { NotificationType } from "@prisma/client";
import { prisma } from "../initPrisma";

export async function deleteNewAssessmentNotification(assessmentId: string) {
  try {
    const deletedNotifications = await prisma.notification.deleteMany({
      where: {
        assessmentId: assessmentId,
        type: NotificationType.NEW_ASSESSMENT,
      },
    });

    return { success: true, count: deletedNotifications.count };
  } catch (error) {
    console.error("Failed to delete new assessment notifications:", error);
    return { success: false, error: "Failed to delete notifications" };
  }
}