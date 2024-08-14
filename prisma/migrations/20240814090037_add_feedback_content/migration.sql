/*
  Warnings:

  - Added the required column `content` to the `AssessmentFeedback` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AssessmentFeedback" ADD COLUMN     "content" TEXT NOT NULL;
