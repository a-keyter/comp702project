"use server";

import { prisma } from "../initPrisma";
import { AssessmentItem, Answer } from "@prisma/client";

export async function saveAssessmentItems(
  assessmentId: string,
  assessmentItems: AssessmentItem[],
  mcqAnswers: Record<string, Answer[]>
) {
  try {
    // console.log('Saving assessment items for assessment:', assessmentId);
    // console.log('Incoming assessmentItems:', JSON.stringify(assessmentItems, null, 2));
    // console.log('Incoming mcqAnswers:', JSON.stringify(mcqAnswers, null, 2));

    await prisma.$transaction(async (tx) => {
      // Get all existing items for this assessment
      const existingItems = await tx.assessmentItem.findMany({
        where: { assessmentId },
        include: { answers: true },
      });
      const existingItemIds = new Set(existingItems.map((item) => item.id));
      // console.log('Existing item IDs for this assessment:', Array.from(existingItemIds));

      // Delete items and their answers that are no longer present
      const itemIdsToKeep = new Set(assessmentItems.map(item => item.id));
      const itemsToDelete = existingItems.filter(item => !itemIdsToKeep.has(item.id));
      
      for (const item of itemsToDelete) {
        await tx.answer.deleteMany({
          where: { assessmentItemId: item.id },
        });
        await tx.assessmentItem.delete({
          where: { id: item.id },
        });
      }
      // console.log('Deleted items and their answers:', itemsToDelete.map(item => item.id));

      // Update or create items and their answers
      for (const item of assessmentItems) {
        // console.log(`Processing item ${item.id}, type: ${item.type}`);
        
        try {
          let dbItem;
          if (existingItemIds.has(item.id)) {
            // Update existing item
            dbItem = await tx.assessmentItem.update({
              where: { id: item.id },
              data: {
                index: item.index,
                content: item.content,
                type: item.type,
              },
            });
            // console.log(`Updated item ${item.id}`);
          } else {
            // Create new item
            dbItem = await tx.assessmentItem.create({
              data: {
                id: item.id,
                index: item.index,
                content: item.content,
                type: item.type,
                assessmentId: assessmentId,
              },
            });
            // console.log(`Created new item ${item.id}`);
          }

          if (item.type === "MCQ" && mcqAnswers[item.id]) {
            // console.log(`Processing answers for MCQ item ${item.id}`);
            
            // Get existing answers for this item
            const existingAnswers = existingItems.find(i => i.id === item.id)?.answers || [];
            const existingAnswerIds = new Set(existingAnswers.map(a => a.id));

            // Delete answers that are no longer present
            const answerIdsToKeep = new Set(mcqAnswers[item.id].map(a => a.id));
            const answersToDelete = existingAnswers.filter(a => !answerIdsToKeep.has(a.id));
            
            for (const answer of answersToDelete) {
              await tx.answer.delete({
                where: { id: answer.id },
              });
            }
            // console.log(`Deleted answers for item ${item.id}:`, answersToDelete.map(a => a.id));

            // Update or create answers
            for (const answer of mcqAnswers[item.id]) {
              if (existingAnswerIds.has(answer.id)) {
                await tx.answer.update({
                  where: { id: answer.id },
                  data: {
                    content: answer.content,
                    isCorrect: answer.isCorrect,
                  },
                });
                // console.log(`Updated answer ${answer.id}`);
              } else {
                await tx.answer.create({
                  data: {
                    id: answer.id,
                    content: answer.content,
                    isCorrect: answer.isCorrect,
                    assessmentItemId: item.id,
                  },
                });
                // console.log(`Created new answer ${answer.id}`);
              }
            }
            // console.log(`Finished processing answers for item ${item.id}`);
          } else {
            // console.log(`No answers to process for item ${item.id}. Type: ${item.type}`);
          }
        } catch (error) {
          console.error(`Error processing item ${item.id}:`, error);
          throw error; // Re-throw to roll back the transaction
        }
      }

      // const finalCheck = await tx.assessmentItem.findMany({
      //   where: { assessmentId },
      //   include: { answers: true },
      // });
      // console.log('Final check - Items and Answers in DB:', JSON.stringify(finalCheck, null, 2));
    });

    return { success: true };
  } catch (error) {
    console.error("Error saving assessment items:", error);
    return { success: false, error: "Failed to save assessment items" };
  }
}