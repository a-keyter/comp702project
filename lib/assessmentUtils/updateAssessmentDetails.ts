"use server";

import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { prisma } from "../initPrisma";

const UpdateAssessmentSchema = z.object({
  assessmentId: z.string().min(1, {
    message: "Assessment ID is required.",
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

type UpdateAssessmentData = z.infer<typeof UpdateAssessmentSchema>;

export async function updateAssessmentDetails(
  formData: UpdateAssessmentData
): Promise<void> {
  // Validate the form data
  const validatedData = UpdateAssessmentSchema.parse(formData);

  // Fetch the current user ID using Clerk auth
  const { userId } = auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  try {
    // Check if the assessment exists and the user has permission to update it
    const existingAssessment = await prisma.assessment.findUnique({
      where: {
        id: validatedData.assessmentId,
        class: { taughtBy: { some: { id: userId } } },
      },
      select: { createdById: true, classId: true },
    });

    if (!existingAssessment) {
      throw new Error("Assessment not found");
    }

    // Update the assessment
    await prisma.assessment.update({
      where: { id: validatedData.assessmentId },
      data: {
        title: validatedData.title,
        objectives: validatedData.objectives,
        dueDate: validatedData.dueDate,
      },
    });

    // TODO - Could add logic here to notify students of the update
    // await notifyStudentsOfUpdate(existingAssessment.classId, validatedData.assessmentId);
  } catch (error) {
    console.error("Error updating assessment:", error);
    throw error;
  }
}
