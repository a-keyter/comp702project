"use server"

import { auth } from "@clerk/nextjs/server";
import { prisma } from "../initPrisma";
import { newAssessmentNotification } from "../notificationUtils/newAssessmentNotification";

export async function setAssessmentLive(assessmentId: string) {

     // Fetch the current user ID using Clerk auth
     const { userId } = auth();

     if (!userId) {
       throw new Error("User not authenticated");
     }

    try {
        const updatedAssessment = await prisma.assessment.update({
            where: {
                id: assessmentId,
            },
            data: {
                status: "LIVE",
                updatedAt: new Date(),
            },
            include: {
                class: {
                    include: {
                        members: true
                    }
                }
            }
        });

        await Promise.all(updatedAssessment.class.members.map(student => 
            newAssessmentNotification(updatedAssessment.id, updatedAssessment.classId, userId, student.id)
          ));

        return updatedAssessment.id;
    } catch (error) {
        console.error(`Error setting assessment ${assessmentId} live:`, error);
        throw error;
    }
}