import { auth } from "@clerk/nextjs/server";
import { prisma } from "../initPrisma";

export async function getStudentClassesByNickname(studentNickname: string) {
  const {userId} = auth();

  if (!userId) {
    return null;
  }

  const classes = await prisma.class.findMany({
    where: {
      members: {
        some: { nickname: studentNickname },
      },
      OR: [
        {
          taughtBy: {
            some: {
              id: userId,
            },
          },
        },
        {
          members: {
            some: {
              id: userId,
            },
          },
        },
      ],
    },
  });

  return classes
}
