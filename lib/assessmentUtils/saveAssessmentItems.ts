"use server";

import { prisma } from "../initPrisma";
import { AssessmentItem, Answer } from "@prisma/client";

export async function saveAssessmentItems(
  assessmentId: string,
  assessmentItems: AssessmentItem[],
  mcqAnswers: Record<string, Answer[]>
) {
  try {
    // Fetch all existing assessment items for the given assessment
    const existingItems = await prisma.assessmentItem.findMany({
      where: { assessmentId },
      include: { answers: true },
    });

    // Create a Set of item IDs that should be kept
    const itemIdsToKeep = new Set(assessmentItems.map(item => item.id));

    // Prepare batch operations for deleting and upserting items
    const deleteItems = existingItems.filter(item => !itemIdsToKeep.has(item.id)).map(item => item.id);
    const upsertItems = assessmentItems.map(item => ({
      where: { id: item.id },
      update: { index: item.index, content: item.content, type: item.type },
      create: { id: item.id, index: item.index, content: item.content, type: item.type, assessmentId },
    }));

    // Prepare operations for handling MCQ answers
    const answerOps = assessmentItems.flatMap(item => {
      // Skip non-MCQ items or items without answers
      if (item.type !== "MCQ" || !mcqAnswers[item.id]) return [];

      const existingAnswers = existingItems.find(i => i.id === item.id)?.answers || [];
      const answerIdsToKeep = new Set(mcqAnswers[item.id].map(a => a.id));

      // Determine which answers to delete and which to upsert
      const deleteAnswers = existingAnswers.filter(a => !answerIdsToKeep.has(a.id)).map(a => a.id);
      const upsertAnswers = mcqAnswers[item.id].map(answer => ({
        where: { id: answer.id },
        update: { content: answer.content, isCorrect: answer.isCorrect },
        create: { id: answer.id, content: answer.content, isCorrect: answer.isCorrect, assessmentItemId: item.id },
      }));

      return [{ deleteAnswers, upsertAnswers }];
    });

    // Execute all database operations in a single transaction
    await prisma.$transaction([
      // Delete items that are no longer needed
      prisma.assessmentItem.deleteMany({ where: { id: { in: deleteItems } } }),
      // Delete answers associated with deleted items
      ...deleteItems.map(id => prisma.answer.deleteMany({ where: { assessmentItemId: id } })),
      // Upsert (update or insert) assessment items
      ...upsertItems.map(item => prisma.assessmentItem.upsert(item)),
      // Handle MCQ answers: delete unnecessary ones and upsert the rest
      ...answerOps.flatMap(({ deleteAnswers, upsertAnswers }) => [
        prisma.answer.deleteMany({ where: { id: { in: deleteAnswers } } }),
        ...upsertAnswers.map(answer => prisma.answer.upsert(answer)),
      ]),
    ]);

    // Return success if all operations complete without error
    return { success: true };
  } catch (error) {
    // Log and return error if any operation fails
    console.error("Error saving assessment items:", error);
    return { success: false, error: "Failed to save assessment items" };
  }
}