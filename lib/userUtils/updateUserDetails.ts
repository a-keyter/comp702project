'use server'

import { z } from "zod";
import { prisma } from "../initPrisma";
import { auth } from "@clerk/nextjs/server";

const UpdateUserSchema = z.object({
  name: z.string().min(2),
  nickname: z.string().min(2).regex(/^[a-zA-Z0-9-]+$/, {
    message: "Nickname must contain only alphanumeric characters (No spaces).",
  }),
});

export async function updateUserDetails(data: z.infer<typeof UpdateUserSchema>) {
  // Fetch the current user using Clerk auth
  const {userId} = await auth()

  if (!userId) {
    throw new Error("User is not authenticated");
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


