-- DropForeignKey
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_assessmentItemId_fkey";

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_assessmentItemId_fkey" FOREIGN KEY ("assessmentItemId") REFERENCES "AssessmentItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
