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

// Util for fetching User - NEVER PASS THE USER ID TO CLIENT
export async function getUserByNickname(nickname: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: {
        nickname: nickname,
      },
    });

    return user;
  } catch (error) {
    console.error("Error fetching user by nickname:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

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




