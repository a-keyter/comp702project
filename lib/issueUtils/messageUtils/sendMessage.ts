"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/initPrisma";

export async function sendNewMessage(
  issueId: string,
  userRole: string,
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
