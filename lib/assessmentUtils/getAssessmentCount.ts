import { $Enums } from "@prisma/client";
import { prisma } from "../initPrisma";

export async function getAssessmentCount(classId: string): Promise<number> {
    try {
      const count = await prisma.assessment.count({
        where: {
          classId: classId,
          status: $Enums.AssessmentStatus.LIVE,
        },
      });
  
      return count;
    } catch (error) {
      console.error("Error fetching live assessment count:", error);
      throw error;
    }
  }
  