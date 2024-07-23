"use server"

import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { prisma } from "../initPrisma";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  nickname: z.string().min(2, {
    message: "Nickname must be at least 2 characters.",
  }),
  teachermode: z.boolean().default(false).optional(),
});

type FormData = z.infer<typeof FormSchema>;

export async function createUser(data: FormData) {
  // Validate the data
  const parsedData = FormSchema.parse(data);

  // Fetch the current user ID using Clerk auth
  const { userId } = auth();

  if (!userId) {
    throw new Error("User is not authenticated");
  }

  // Determine the role based on teachermode
  const role = parsedData.teachermode ? "TEACHER" : "STUDENT";

  const newUser = await prisma.user.create({
    data: {
      id: userId,
      name: parsedData.name,
      nickname: parsedData.nickname,
      role,
    },
  });

  return newUser;
}
