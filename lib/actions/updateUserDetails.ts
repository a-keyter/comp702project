// lib/actions/updateUserDetails.ts
'use server'

import { z } from "zod";
import { prisma } from "../initPrisma";
import { auth } from "@clerk/nextjs/server";

const UpdateUserSchema = z.object({
  name: z.string().min(2),
  nickname: z.string().min(2),
});

export async function updateUserDetails(data: z.infer<typeof UpdateUserSchema>) {
  const { userId } = auth();
  
  if (!userId) {
    throw new Error('Not authenticated');
  }

  const validatedData = UpdateUserSchema.parse(data);

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: validatedData,
    });

    return {
      name: updatedUser.name,
      nickname: updatedUser.nickname,
      role: updatedUser.role,
    };
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Failed to update user details');
  }
}