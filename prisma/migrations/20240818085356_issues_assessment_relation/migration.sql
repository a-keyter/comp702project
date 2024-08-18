-- AlterTable
ALTER TABLE "Issue" ADD COLUMN     "relevantAssessmentId" TEXT;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_relevantAssessmentId_fkey" FOREIGN KEY ("relevantAssessmentId") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
