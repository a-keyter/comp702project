/*
  Warnings:

  - You are about to drop the `AssessmentFeedback` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AssessmentFeedback" DROP CONSTRAINT "AssessmentFeedback_assessmentId_fkey";

-- DropForeignKey
ALTER TABLE "AssessmentFeedback" DROP CONSTRAINT "AssessmentFeedback_lastSubmissionId_fkey";

-- DropTable
DROP TABLE "AssessmentFeedback";

-- CreateTable
CREATE TABLE "TeacherFeedback" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "submissionCount" INTEGER NOT NULL,
    "lastSubmissionId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeacherFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TeacherFeedback_assessmentId_key" ON "TeacherFeedback"("assessmentId");

-- CreateIndex
CREATE UNIQUE INDEX "TeacherFeedback_lastSubmissionId_key" ON "TeacherFeedback"("lastSubmissionId");

-- AddForeignKey
ALTER TABLE "TeacherFeedback" ADD CONSTRAINT "TeacherFeedback_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherFeedback" ADD CONSTRAINT "TeacherFeedback_lastSubmissionId_fkey" FOREIGN KEY ("lastSubmissionId") REFERENCES "Submission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
