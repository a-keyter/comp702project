-- DropForeignKey
ALTER TABLE "Response" DROP CONSTRAINT "Response_assessmentItemId_fkey";

-- DropForeignKey
ALTER TABLE "Response" DROP CONSTRAINT "Response_givenAnswerId_fkey";

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_assessmentItemId_fkey" FOREIGN KEY ("assessmentItemId") REFERENCES "AssessmentItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_givenAnswerId_fkey" FOREIGN KEY ("givenAnswerId") REFERENCES "Answer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
