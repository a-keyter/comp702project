'use server'

import { prisma } from '@/lib/initPrisma'
import { deleteNewAssessmentNotification } from '../notificationUtils/deleteNewAssessmentNotification'

export async function deleteAssessment(assessmentId: string) {
  try {
    // Start a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Delete all responses associated with the assessment
      await tx.response.deleteMany({
        where: {
          submission: {
            assessmentId: assessmentId
          }
        }
      })

      // Delete all submissions associated with the assessment
      await tx.submission.deleteMany({
        where: {
          assessmentId: assessmentId
        }
      })

      // Delete all answers associated with the assessment items
      await tx.answer.deleteMany({
        where: {
          assessmentItem: {
            assessmentId: assessmentId
          }
        }
      })

      // Delete all assessment items
      await tx.assessmentItem.deleteMany({
        where: {
          assessmentId: assessmentId
        }
      })

      // Finally, delete the assessment itself
      await tx.assessment.delete({
        where: {
          id: assessmentId
        }
      })

      return { success: true }
    })

    await deleteNewAssessmentNotification(assessmentId)

    return result
  } catch (error) {
    console.error('Error deleting assessment:', error)
    throw new Error('Failed to delete assessment')
  }
}