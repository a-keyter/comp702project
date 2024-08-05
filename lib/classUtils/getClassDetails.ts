"use server"

import { Class } from "@prisma/client";
import { prisma } from "../initPrisma";
import { getUserById, SafeUser } from "../userUtils/getUserDetails";
import { auth } from "@clerk/nextjs/server";

export type SafeClass = {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ClassWithCreator = {
  class: SafeClass;
  creator: SafeUser | null;
};

// FETCH SPECIFIC CLASS
export async function getClassById(classId: string): Promise<(Class & { memberCount: number }) | null> {
  try {
    const classData = await prisma.class.findUnique({
      where: {
        id: classId.toLowerCase(), // Ensure we're using lowercase for consistency
      },
      include: {
        _count: {
          select: { members: true }
        }
      }
    });

    if (!classData) {
      return null;
    }

    return {
      ...classData,
      memberCount: classData._count.members
    };

  } catch (error) {
    console.error("Error fetching class:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// FETCH SPECIFIC CLASS Title
export async function getClassTitleById(classId: string): Promise<string | null> {
  try {
  const classData = await prisma.class.findUnique({
      select: {
        title: true
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


export async function getClassWithCreator(classCode: string) {
  try {
    // Fetch the class data
    const classData = await prisma.class.findUnique({
      where: {
        id: classCode.toLowerCase(), // Ensure we're using lowercase for consistency
      },
    });

    if (!classData) {
      return null; // Class not found
    }

    // Fetch the creator's details using the createdById
    const creatorDetails = await getUserById(classData.createdById);

    if (!creatorDetails) {
      return null; // Creator not found.
    }

    return {
      class: {
        id: classData.id,
        title: classData.title,
        description: classData.description,
        createdAt: classData.createdAt,
        updatedAt: classData.updatedAt,
      },
      creator: {
        name: creatorDetails.name,
        nickname: creatorDetails.nickname,
        role: creatorDetails.role,
      },
    };
  } catch (error) {
    console.error("Error fetching class with creator:", error);
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

  const user = await getUserById(userId);

  if (!user) {
    return null;
  }

  let classes: SafeClass[];

  if (user.role === 'TEACHER') {
    // If user.role === TEACHER, fetch all classes where class.createdBy === user.id
    classes = await prisma.class.findMany({
      where: {
        createdById: user.id
      },
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });
  } else if (user.role === 'STUDENT') {
    // If user.role === STUDENT, fetch all classes where class.members contains user.Id
    classes = await prisma.class.findMany({
      where: {
        members: {
          some: {
            id: user.id
          }
        }
      },
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });
  } else {
    // If the role is neither TEACHER nor STUDENT, return null
    return null;
  }

  return classes;
}
