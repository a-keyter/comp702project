"use server"

import { NotificationType } from "@prisma/client"
import { prisma } from "../initPrisma"

export async function newClassNotification(classId: string, senderId: string, recipientId: string) {
    try {
        const newNotification = await prisma.notification.create({
            data: {
                type: NotificationType.CLASS_JOIN_ACCEPTED,
                class: { connect: { id: classId } },
                sender: { connect: { id: senderId } },
                recipient: { connect: { id: recipientId } }
            }
        })
        
        return newNotification
        
    } catch (error) {
        console.error("Failed to upsert message notification:", error)
        return { success: false, error: "Failed to create or update notification" }
    }
}