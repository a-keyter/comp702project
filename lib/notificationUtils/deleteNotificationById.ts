"use server";

import { prisma } from "../initPrisma";

export async function deleteNotificationById(notificationId: string) {
  try {
    const deletedNotification = await prisma.notification.delete({
      where: {
        id: notificationId,
      },
    });

    return { success: true, notification: deletedNotification };
  } catch (error) {
    console.error("Failed to delete notification:", error);
    return { success: false, error: "Failed to delete notification" };
  }
}