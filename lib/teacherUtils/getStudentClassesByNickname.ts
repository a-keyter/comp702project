import { prisma } from "../initPrisma";

export async function getStudentClassesByNickname(studentNickname: string, userId: string) {
  const classes = await prisma.class.findMany({
    where: {
      members: {
        some: { nickname: studentNickname },
      },
      taughtBy: {
        some: {
          id: userId,
        },
      },
    },
  });

  return classes
}
