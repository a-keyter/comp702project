"use server"

import { prisma } from "@/lib/initPrisma";
import { auth } from "@clerk/nextjs/server";

export async function getUserNotificationCount(): Promise<number> {
  try {
    // Fetch the current user ID using Clerk auth
    const { userId } = auth();

    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Fetch the count of unread notifications for the user
    const count = await prisma.notification.count({
      where: {
        recipientId: userId,
        is_unread: true,
      },
    });

    return count;
  } catch (error) {
    // console.error("Failed to fetch user notification count:", error);
    return 0; // Return 0 if there's an error
  }
}