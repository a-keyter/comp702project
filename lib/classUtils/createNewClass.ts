"use server";

import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const FormSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  classCode: z
    .string()
    .min(6, {
      message: "Class code must be at least 6 characters.",
    })
    .max(8, {
      message: "Class code must be 8 characters at most.",
    })
    .transform((val) => val.toLowerCase()), // Transform to lowercase to ensure url readability
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
});

type FormData = z.infer<typeof FormSchema>;

export async function createNewClass(formData: FormData) {
  try {
    // Validate the form data
    const validatedData = FormSchema.parse(formData);

    // Fetch the current user ID using Clerk auth
    const { userId } = auth();

    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Create a new class using Prisma
    const newClass = await prisma.class.create({
      data: {
        id: validatedData.classCode, // Using classCode as the ID
        title: validatedData.title,
        description: validatedData.description,
        // FIX THE BUG
        taughtBy: {
          connect: { id: userId },
        },
      },
    });

    return newClass;
  } catch (error) {
    console.error("Error creating new class:", error);
    throw error;
  }
}
