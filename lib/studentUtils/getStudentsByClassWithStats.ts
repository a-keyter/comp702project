"use server";

import { prisma } from "../initPrisma";

export type Student = {
  name: string;
  nickname: string;
  assessmentsCompleted: string;
  averageGrade: number;
};

export async function getStudentsByClassWithStats(
  classId: string
): Promise<Student[]> {
  try {
    const classWithStudentsAndAssessments = await prisma.class.findUnique({
      where: {
        id: classId,
      },
      include: {
        members: {
          where: {
            role: "STUDENT",
          },
          include: {
            submissions: {
              orderBy: {
                createdAt: "desc",
              },
              where: {
                assessment: {
                  classId: classId,
                }
              },
              distinct: ["assessmentId"],
              include: {
                assessment: true,
              },
            },
          },
        },
        assessments: true,
      },
    });

    if (!classWithStudentsAndAssessments) {
      throw new Error("Class not found");
    }

    const totalAssessments = classWithStudentsAndAssessments.assessments.length;

    const studentsWithStats: Student[] =
      classWithStudentsAndAssessments.members.map((student) => {
        const completedSubmissions = student.submissions.filter(
          (sub) => sub.score !== null
        );
        const assessmentsCompleted = completedSubmissions.length;
        const totalScore = completedSubmissions.reduce(
          (sum, sub) => sum + (sub.score || 0),
          0
        );
        const averageGrade =
          assessmentsCompleted > 0 ? totalScore / assessmentsCompleted : 0;

        return {
          name: student.name,
          nickname: student.nickname,
          assessmentsCompleted: `${assessmentsCompleted} out of ${totalAssessments}`,
          averageGrade: Number(averageGrade.toFixed(2)),
        };
      });

    return studentsWithStats;
  } catch (error) {
    console.error("Error fetching students with assessment stats:", error);
    throw error;
  }
}
