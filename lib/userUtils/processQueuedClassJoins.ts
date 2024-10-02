"use server";

import { prisma } from "@/lib/initPrisma";
import { addUserToClass } from "../classUtils/addUserToClass";
import { newClassNotification } from "../notificationUtils/newClassNotification";

export async function processQueuedClassJoins(userEmail: string) {
  try {
    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Find all queued class joins for this user
    const queuedJoins = await prisma.queuedClassJoin.findMany({
      where: { email: userEmail },
      include: { class: true, raisedBy: true },
    });

    const results = await Promise.allSettled(
      queuedJoins.map(async (queuedJoin) => {
        try {
          // Add the student to the class
          await addUserToClass(queuedJoin.classId!, user.id);

          // Send a notification
          await newClassNotification(queuedJoin.classId!, queuedJoin.raisedById, user.id);

          // Delete the processed queue entry
          await prisma.queuedClassJoin.delete({
            where: { id: queuedJoin.id },
          });

          return {
            success: true,
            classId: queuedJoin.classId,
            className: queuedJoin.class?.title,
          };
        } catch (error) {
          return {
            success: false,
            classId: queuedJoin.classId,
            className: queuedJoin.class?.title,
            error: error instanceof Error ? error.message : "Unknown error occurred",
          };
        }
      })
    );

    const successful = results.filter(
      (result): result is PromiseFulfilledResult<{ success: true; classId: string; className: string | undefined }> =>
        result.status === "fulfilled" && result.value.success
    );

    const failed = results.filter(
      (result): result is PromiseFulfilledResult<{ success: false; classId: string; className: string | undefined; error: string }> =>
        result.status === "fulfilled" && !result.value.success
    );

    return {
      processedCount: successful.length,
      failedCount: failed.length,
      successful: successful.map(result => result.value),
      failed: failed.map(result => result.value),
    };

  } catch (error) {
    console.error("Error processing queued class joins:", error);
    throw error;
  }
}