"use server"

import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { prisma } from "../initPrisma";
import { newAssessmentNotification } from "../notificationUtils/newAssessmentNotification";

const FormSchema = z.object({
    classId: z
      .string()
      .min(6, {
        message: "Class code must be at least 6 characters.",
      })
      .max(8, {
        message: "Class code must be 8 characters at most.",
      })
      .regex(/^[a-zA-Z0-9-]+$/, {
        message: "Class code must contain only alphanumeric characters and hyphens (No spaces).",
      }),
    title: z.string().min(2, {
      message: "Title must be at least 2 characters.",
    }),
    objectives: z.string().min(10, {
      message: "Learning objectives must be at least 10 characters.",
    }),
    dueDate: z.date({
      required_error: "Due date is required.",
    }),
  });


type FormData = z.infer<typeof FormSchema>;

export async function createNewAssessment(formData: FormData): Promise<string> {

    // Validate the form data
    const validatedData = FormSchema.parse(formData);

    // Fetch the current user ID using Clerk auth
    const { userId } = auth();

    if (!userId) {
      throw new Error("User not authenticated");
    }

    try {  
      // Create new assessment
      const newAssessment = await prisma.assessment.create({
        data: {
          title: validatedData.title,
          objectives: validatedData.objectives,
          classId: validatedData.classId,
          createdById: userId,
          dueDate: validatedData.dueDate 
        },
      });
  
      // Return the assessment ID
      return newAssessment.id;
    } catch (error) {
      console.error("Error creating new assessment:", error);
      throw error;
    }
  }