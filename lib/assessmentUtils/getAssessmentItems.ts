'use server'

import { prisma } from '../initPrisma'
import { Answer } from '@prisma/client'

export async function loadAssessmentItems(assessmentId: string) {
  try {
    const assessmentItems = await prisma.assessmentItem.findMany({
      where: { assessmentId },
      orderBy: { index: 'asc' },
      select: {
        id: true,
        index: true,
        content: true,
        type: true,
        assessmentId: true,
        answers: {
          select: {
            id: true,
            content: true,
            isCorrect: true,
            assessmentItemId: true
          }
        }
      }
    })

   console.log('Raw assessment items from database:', JSON.stringify(assessmentItems, null, 2));

    // Restructure the data to match the expected format
    const mcqAnswers: Record<string, Answer[]> = {}
    const items = assessmentItems.map(item => {
      if (item.type === 'MCQ') {
        mcqAnswers[item.id] = item.answers as Answer[]
      }
      // Omit the answers from the item object
      const { answers, ...itemWithoutAnswers } = item
      return itemWithoutAnswers
    })

    return { 
      success: true, 
      assessmentItems: items, 
      mcqAnswers 
    }
  } catch (error) {
    console.error('Error loading assessment data:', error)
    return { 
      success: false, 
      error: 'Failed to load assessment data' 
    }
  }
}