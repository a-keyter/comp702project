/*
  Warnings:

  - You are about to drop the column `overallFeedback` on the `Assessment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Assessment" DROP COLUMN "overallFeedback";

-- CreateTable
CREATE TABLE "AssessmentFeedback" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "submissionCount" INTEGER NOT NULL,
    "lastSubmissionId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssessmentFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AssessmentFeedback_assessmentId_key" ON "AssessmentFeedback"("assessmentId");

-- CreateIndex
CREATE UNIQUE INDEX "AssessmentFeedback_lastSubmissionId_key" ON "AssessmentFeedback"("lastSubmissionId");

-- AddForeignKey
ALTER TABLE "AssessmentFeedback" ADD CONSTRAINT "AssessmentFeedback_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentFeedback" ADD CONSTRAINT "AssessmentFeedback_lastSubmissionId_fkey" FOREIGN KEY ("lastSubmissionId") REFERENCES "Submission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
