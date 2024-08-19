"use server"

import { NotificationType } from "@prisma/client"
import { prisma } from "../initPrisma"

export async function newMessageNotification(issueId: string, senderId: string, recipientId: string) {
    try {
        const notification = await prisma.notification.upsert({
            where: {
                type_issueId_senderId_recipientId: {
                    type: NotificationType.NEW_ISSUE_MESSAGE,
                    issueId: issueId,
                    senderId: senderId,
                    recipientId: recipientId
                }
            },
            update: {
                is_unread: true,
                updatedAt: new Date() // Update the timestamp
            },
            create: {
                type: NotificationType.NEW_ISSUE_MESSAGE,
                issue: { connect: { id: issueId } },
                sender: { connect: { id: senderId } },
                recipient: { connect: { id: recipientId } },
                is_unread: true
            }
        })
        
        return { success: true, notification: notification }
    } catch (error) {
        console.error("Failed to upsert message notification:", error)
        return { success: false, error: "Failed to create or update notification" }
    }
}