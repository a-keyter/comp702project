"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/initPrisma";
import { newMessageNotification } from "@/lib/notificationUtils/newMessageNotification";

export async function sendNewMessage(
  issueId: string,
  messageContent: string
) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthorized: User not authenticated");
  }

  try {
    // First, verify that the issue exists
    const issue = await prisma.issue.findUnique({
      where: { id: issueId },
      include: {
        relevantClass: {
          include: {
            taughtBy: true
          }
        }
      }
    });

    if (!issue) {
      throw new Error("Issue not found");
    }

    // Create the new message
    const newMessage = await prisma.message.create({
      data: {
        content: messageContent,
        sender: { connect: { id: userId } },
        issue: { connect: { id: issueId } },
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Update the issue's lastUpdatedBy and updatedAt
    if (issue.status === "UNREAD") {
      await prisma.issue.update({
        where: { id: issueId },
        data: {
          lastUpdatedBy: { connect: { id: userId } },
          updatedAt: new Date(),
          status: "OPEN",
        },
      });
    } else {
      await prisma.issue.update({
        where: { id: issueId },
        data: {
          lastUpdatedBy: { connect: { id: userId } },
          updatedAt: new Date(),
        },
      });
    }

    // Get the IDs for the users involved:
    const studentId = issue.raisedById
    const teachers = issue.relevantClass.taughtBy

    // If the message sender is the student, notify the teachers, otherwise notify the student.
    if (userId === studentId) {
      await Promise.all(teachers.map(teacher => 
        newMessageNotification(issueId, userId, teacher.id)
      ));
    } else {
      await newMessageNotification(issueId, userId, studentId)
    }


    return {
      id: newMessage.id,
      content: newMessage.content,
      createdAt: newMessage.createdAt,
      sender: {
        id: newMessage.sender.id,
        name: newMessage.sender.name,
      },
    };
  } catch (error) {
    console.error("Error sending new message:", error);
    throw new Error("Failed to send message");
  }
}
