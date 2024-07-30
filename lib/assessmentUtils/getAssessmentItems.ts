'use server'

import { prisma } from '../initPrisma'
import { Answer } from '@prisma/client'

export async function loadAssessmentItems(assessmentId: string) {
  try {
    const assessmentItems = await prisma.assessmentItem.findMany({
      where: { assessmentId },
      orderBy: { index: 'asc' },
      include: {
        answers: true
      }
    })

    // Restructure the data to match the expected format
    const mcqAnswers: Record<string, Answer[]> = {}
    const items = assessmentItems.map(item => {
      if (item.type === 'MCQ') {
        mcqAnswers[item.id] = item.answers
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