-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'CLASS_REMOVAL';

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_senderId_fkey";

-- DropForeignKey
ALTER TABLE "TeacherFeedback" DROP CONSTRAINT "TeacherFeedback_lastSubmissionId_fkey";

-- AddForeignKey
ALTER TABLE "TeacherFeedback" ADD CONSTRAINT "TeacherFeedback_lastSubmissionId_fkey" FOREIGN KEY ("lastSubmissionId") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
