"use server"

import { prisma } from "@/lib/initPrisma";
import { auth } from "@clerk/nextjs/server";

export async function getUserNotifications() {
  try {
    // Fetch the current user ID using Clerk auth
    const { userId } = auth();

    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Fetch notifications for the user
    const notifications = await prisma.notification.findMany({
      where: {
        recipientId: userId,
      },
      select: {
        id: true,
        type: true,
        classId: true,
        assessmentId: true,
        issueId: true,
        is_unread: true,
        createdAt: true,
        updatedAt: true,
        sender: {
          select: {
            name: true,
          },
        },
        issue: {
          select: {
            id: true,
            type: true,
          },
        },
        assessment: {
          select: {
            id: true,
            title: true,
          },
        },
        class: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, notifications };
  } catch (error) {
    console.error("Failed to fetch user notifications:", error);
    return { success: false, error: "Failed to fetch notifications" };
  }
}