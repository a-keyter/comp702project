-- DropForeignKey
ALTER TABLE "TeacherFeedback" DROP CONSTRAINT "TeacherFeedback_assessmentId_fkey";

-- AddForeignKey
ALTER TABLE "TeacherFeedback" ADD CONSTRAINT "TeacherFeedback_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
