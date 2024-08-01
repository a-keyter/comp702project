'use server'

import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '../initPrisma'

export async function addUserToClass(classCode: string) {
  const { userId } = auth()

  if (!userId) {
    throw new Error('User not authenticated')
  }

  try {
    // Find the class
    const classToJoin = await prisma.class.findUnique({
      where: { id: classCode },
    })

    if (!classToJoin) {
      throw new Error('Class not found')
    }

    // Check if user is already a member of the class
    const existingMembership = await prisma.class.findFirst({
      where: {
        id: classCode,
        members: {
          some: {
            id: userId,
          },
        },
      },
    })

    if (existingMembership) {
      throw new Error('User is already a member of this class')
    }

    // Add user to the class
    await prisma.class.update({
      where: { id: classCode },
      data: {
        members: {
          connect: { id: userId },
        },
      },
    })

    // Revalidate the classes page to reflect the changes
    revalidatePath('/classes')

    return { success: true }
  } catch (error) {
    console.error('Error adding user to class:', error)
    throw error
  }
}