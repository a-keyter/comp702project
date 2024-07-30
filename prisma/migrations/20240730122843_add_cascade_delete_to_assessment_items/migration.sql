-- DropForeignKey
ALTER TABLE "AssessmentItem" DROP CONSTRAINT "AssessmentItem_assessmentId_fkey";

-- AddForeignKey
ALTER TABLE "AssessmentItem" ADD CONSTRAINT "AssessmentItem_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
