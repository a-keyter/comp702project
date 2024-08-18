"use server"

import { prisma } from "@/lib/initPrisma";

type IssueMessage = {
  id: string;
  content: string;
  createdAt: Date;
  sender: {
    name: string;
    role: string;
  };
};

async function fetchIssueMessages(issueId: string): Promise<IssueMessage[] | null> {
  try {
    const messages = await prisma.message.findMany({
      where: {
        issueId: issueId,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        sender: {
          select: {
            name: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return messages.map(message => ({
      id: message.id,
      content: message.content,
      createdAt: message.createdAt,
      sender: {
        name: message.sender.name,
        role: message.sender.role
      },
    }));
  } catch (error) {
    console.error("Error fetching issue messages:", error);
    return null;
  }
}

export { fetchIssueMessages };