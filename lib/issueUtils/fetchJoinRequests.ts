"use server"

import { auth } from "@clerk/nextjs/server";
import { prisma } from "../initPrisma";
import { ClassJoinRequest } from "@/components/joinClassTable/columns";

export async function fetchJoinRequests(): Promise<ClassJoinRequest[] | null> {
    const { userId } = auth();
  
    if (!userId) {
      return null;
    }
  
    try {
      const joinRequests = await prisma.issue.findMany({
        where: {
          type: "CLASS_JOIN_REQUEST",
          status: "UNREAD",  // Only fetch UNREAD issues
          relevantClass: {
            taughtBy: {
              some: {
                id: userId,
              },
            },
          },
        },
        include: {
          raisedBy: {
            select: {
              name: true,
              email: true,
              role: true,
            },
          },
          relevantClass: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
  
      return joinRequests.map(request => ({
        issueId: request.id,
        user: {
          name: request.raisedBy.name ?? '',
          email: request.raisedBy.email ?? '',
          role: request.raisedBy.role ?? '',
        },
        classId: request.relevantClass.id,
        classTitle: request.relevantClass.title,
        createdAt: request.createdAt,
      }));
    } catch (error) {
      console.error("Error fetching join requests:", error);
      return null;
    }
  }