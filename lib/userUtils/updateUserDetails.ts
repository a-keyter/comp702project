// lib/actions/updateUserDetails.ts
'use server'

import { z } from "zod";
import { prisma } from "../initPrisma";
import { auth, currentUser } from "@clerk/nextjs/server";

const UpdateUserSchema = z.object({
  name: z.string().min(2),
  nickname: z.string().min(2),
});

export async function updateUserDetails(data: z.infer<typeof UpdateUserSchema>) {
  // Fetch the current user using Clerk auth
  const user = await currentUser()

  if (!user) {
    throw new Error("User is not authenticated");
  }

  const validatedData = UpdateUserSchema.parse(data);

  try {
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
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