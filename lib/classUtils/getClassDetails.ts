"use server";

import { Class } from "@prisma/client";
import { prisma } from "../initPrisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
// Fetch specific class by id
export async function getClassById(
  classId: string
): Promise<(Class & { memberCount: number }) | null> {
  const { userId } = auth();

  if (!userId) {
    redirect('/'); // Redirect to login if no user is authenticated
  }

  try {
    const classData = await prisma.class.findUnique({
      where: {
        id: classId.toLowerCase(), // Ensure we're using lowercase for consistency
      },
      include: {
        _count: {
          select: { members: true },
        },
        taughtBy: {
          where: { id: userId },
          select: { id: true },
        },
        members: {
          where: { id: userId },
          select: { id: true },
        },
      },
    });

    if (!classData) {
      return null;
    }

    // Check if the user is neither teaching nor a member of the class
    if (classData.taughtBy.length === 0 && classData.members.length === 0) {
      return null;
    }

    return {
      ...classData,
      memberCount: classData._count.members,
    };
  } catch (error) {
    console.error("Error fetching class:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// FETCH SPECIFIC CLASS Title
export async function getClassTitleById(
  classId: string
): Promise<string | null> {
  try {
    const classData = await prisma.class.findUnique({
      select: {
        title: true,
      },
      where: {
        id: classId.toLowerCase(), // Ensure we're using lowercase for consistency
      },
    });
    return classData ? classData.title : null;
  } catch (error) {
    console.error("Error fetching class title:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// FETCH ALL CLASSES BY USER ID
export async function getUserClasses() {
  const { userId } = auth();
  if (!userId) {
    return null;
  }
  const classes = await prisma.class.findMany({
      where: {
        OR: [
          {
            taughtBy: {
              some: {
                id: userId,
              },
            },
          },
          {
            members: {
              some: {
                id: userId,
              },
            },
          },
        ],
      },
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
  });
  return classes;
}






