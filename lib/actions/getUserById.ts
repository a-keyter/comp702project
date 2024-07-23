"use server"

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