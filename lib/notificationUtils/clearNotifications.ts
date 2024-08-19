"use server"

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/initPrisma";

export async function clearUnreadNotifications() {
    try {
        const { userId } = auth();

        if (!userId) {
            throw new Error("User not authenticated");
        }

        // Update all unread notifications for the user
        const result = await prisma.notification.updateMany({
            where: {
                recipientId: userId,
                is_unread: true
            },
            data: {
                is_unread: false
            }
        });

        return { success: true, clearedCount: result.count };
    } catch (error) {
        console.error("Failed to clear unread notifications:", error);
        return { success: false, error: "Failed to clear notifications" };
    }
}