"use server";
import { prisma } from "../initPrisma";

export async function removeStudentByNickname(nickname: string, classId: string) {
  try {
    // Find the user by nickname
    const user = await prisma.user.findUnique({
      where: { nickname: nickname },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Check if the user is a member of the class
    const classToLeave = await prisma.class.findFirst({
      where: {
        id: classId,
        members: {
          some: {
            id: user.id,
          },
        },
      },
    });

    if (!classToLeave) {
      throw new Error("Student is not a member of this class");
    }

    // Remove the user from the class
    await prisma.class.update({
      where: { id: classId },
      data: {
        members: {
          disconnect: { id: user.id },
        },
      },
    });

    // Then delete submissions for the student in this class
    await prisma.submission.deleteMany({
      where: {
        userId: user.id,
        assessment: {
          classId: classId,
        },
      },
    });

    return { success: true, message: `${user.name} successfully removed from class - ${classId}` };
  } catch (error) {
    console.error("Error removing student from class:", error);
    throw error;
  }
}