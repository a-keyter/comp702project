"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "../initPrisma";

export async function getUserById(id: string) {
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

export type SafeUser = {
  name: string;
  nickname: string;
  role: string;
};

export async function getUserDetails(): Promise<SafeUser | null> {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  const user = await getUserById(userId);

  if (!user) {
    return null;
  }

  // Only return safe, non-sensitive user information
  return {
    name: user.name,
    nickname: user.nickname,
    role: user.role,
  };
}
