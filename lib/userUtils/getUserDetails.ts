"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "../initPrisma";
import { User } from "@prisma/client";

// Util for fetching User by ID
export async function getUserById(id: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: id },
    });
    return user;
  } catch (error) {
    console.error(error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}

// Frontend should NEVER see userId.
export type SafeUser = {
  name: string;
  nickname: string;
  role: string;
  email: string;
};

// GET CURRENT USER DETAILS - Frontend should NEVER see userId.
export async function getCurrentUser(): Promise<SafeUser | null> {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  const user = await getUserById(userId);

  if (!user) {
    return null
  }

  // Only return safe, non-sensitive user information
  return {
    name: user.name,
    nickname: user.nickname,
    role: user.role,
    email: user.email,
  };
}

// Util for fetching User by nickname - NEVER PASS THE USER ID TO CLIENT
export async function getUserByNickname(nickname: string): Promise<User | null> {
  const {userId} = auth();

  if (!userId) {
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        nickname: nickname,
      },
      include: {
        memberOfClasses: {
          where: {
            taughtBy: {some: {id: userId}},
          },
        },
      },
    });

    // Check if the requested user is a member of classes taught by the current user
    if (user?.memberOfClasses.length === 0) {
      // If user is not a member of any classes taught by the current user
      return null; // Return null to trigger redirect to dashboard 
    }

    return user;
  } catch (error) {
    console.error("Error fetching user by nickname:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Util for fetching User by email - NEVER PASS THE USER ID TO CLIENT
export async function getUserByEmail(userEmail: string): Promise<User | null> {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: userEmail,
      },
    });
    
    return user;
  } catch (error) {
    console.error("Error fetching user by email", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}




