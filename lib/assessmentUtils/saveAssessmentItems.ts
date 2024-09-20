"use server";

import { prisma } from "../initPrisma";
import { AssessmentItem, Answer } from "@prisma/client";

export async function saveAssessmentItems(
  assessmentId: string,
  assessmentItems: AssessmentItem[],
  mcqAnswers: Record<string, Answer[]>
) {
  try {
    // Get all existing items for this assessment
    const existingItems = await prisma.assessmentItem.findMany({
      where: { assessmentId },
      include: { answers: true },
    });
    const itemIdsToKeep = new Set(assessmentItems.map(item => item.id));

    // Prepare batch operations
    const deleteItems = existingItems.filter(item => !itemIdsToKeep.has(item.id)).map(item => item.id);
    const upsertItems = assessmentItems.map(item => ({
      where: { id: item.id },
      update: { index: item.index, content: item.content, type: item.type },
      create: { id: item.id, index: item.index, content: item.content, type: item.type, assessmentId },
    }));

    // Prepare answer operations
    const answerOps = assessmentItems.flatMap(item => {
      if (item.type !== "MCQ" || !mcqAnswers[item.id]) return [];
      const existingAnswers = existingItems.find(i => i.id === item.id)?.answers || [];
      const answerIdsToKeep = new Set(mcqAnswers[item.id].map(a => a.id));

      const deleteAnswers = existingAnswers.filter(a => !answerIdsToKeep.has(a.id)).map(a => a.id);
      const upsertAnswers = mcqAnswers[item.id].map(answer => ({
        where: { id: answer.id },
        update: { content: answer.content, isCorrect: answer.isCorrect },
        create: { id: answer.id, content: answer.content, isCorrect: answer.isCorrect, assessmentItemId: item.id },
      }));

      return [{ deleteAnswers, upsertAnswers }];
    });

    // Execute batch operations
    await prisma.$transaction([
      prisma.assessmentItem.deleteMany({ where: { id: { in: deleteItems } } }),
      ...deleteItems.map(id => prisma.answer.deleteMany({ where: { assessmentItemId: id } })),
      ...upsertItems.map(item => prisma.assessmentItem.upsert(item)),
      ...answerOps.flatMap(({ deleteAnswers, upsertAnswers }) => [
        prisma.answer.deleteMany({ where: { id: { in: deleteAnswers } } }),
        ...upsertAnswers.map(answer => prisma.answer.upsert(answer)),
      ]),
    ]);

    return { success: true };
  } catch (error) {
    console.error("Error saving assessment items:", error);
    return { success: false, error: "Failed to save assessment items" };
  }
}