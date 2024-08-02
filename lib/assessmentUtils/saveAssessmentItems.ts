"use server";

import { prisma } from "../initPrisma";
import { AssessmentItem, Answer } from "@prisma/client";

export async function saveAssessmentItems(
  assessmentItems: AssessmentItem[],
  mcqAnswers: Record<string, Answer[]>
) {
  try {
    await prisma.$transaction(async (tx) => {
      // Get all existing item IDs for this assessment
      const existingItemIds = new Set(
        (
          await tx.assessmentItem.findMany({
            where: { assessmentId: assessmentItems[0].assessmentId },
            select: { id: true },
          })
        ).map((item) => item.id)
      );

      // Delete related responses first
      await tx.response.deleteMany({
        where: {
          givenAnswer: {
            assessmentItemId: {
              notIn: assessmentItems.map((i) => i.id),
            },
          },
        },
      });

      // Then delete answers
      await tx.answer.deleteMany({
        where: {
          assessmentItemId: {
            notIn: assessmentItems.map((i) => i.id),
          },
        },
      });
      
      for (const item of assessmentItems) {
        if (existingItemIds.has(item.id)) {
          // Update existing item
          await tx.assessmentItem.update({
            where: { id: item.id },
            data: {
              index: item.index,
              content: item.content,
              type: item.type,
            },
          });
        } else {
          // Create new item
          await tx.assessmentItem.create({
            data: {
              id: item.id,
              index: item.index,
              content: item.content,
              type: item.type,
              assessmentId: item.assessmentId,
            },
          });
        }

        if (item.type === "MCQ" && mcqAnswers[item.id]) {
          // Get existing answer IDs for this item
          const existingAnswerIds = new Set(
            (
              await tx.answer.findMany({
                where: { assessmentItemId: item.id },
                select: { id: true },
              })
            ).map((answer) => answer.id)
          );

          for (const answer of mcqAnswers[item.id]) {
            if (existingAnswerIds.has(answer.id)) {
              // Update existing answer
              await tx.answer.update({
                where: { id: answer.id },
                data: {
                  content: answer.content,
                  isCorrect: answer.isCorrect,
                },
              });
            } else {
              // Create new answer
              await tx.answer.create({
                data: {
                  id: answer.id,
                  content: answer.content,
                  isCorrect: answer.isCorrect,
                  assessmentItemId: item.id,
                },
              });
            }
          }
        }
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Error saving assessment items:", error);
    return { success: false, error: "Failed to save assessment items" };
  }
}
