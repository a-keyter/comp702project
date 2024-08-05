/*
  Warnings:

  - You are about to drop the `UserFeedback` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserFeedback" DROP CONSTRAINT "UserFeedback_submissionId_fkey";

-- AlterTable
ALTER TABLE "Assessment" ADD COLUMN     "overallFeedback" TEXT;

-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "feedback" TEXT;

-- DropTable
DROP TABLE "UserFeedback";
