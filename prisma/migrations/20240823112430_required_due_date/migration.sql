/*
  Warnings:

  - Made the column `dueDate` on table `Assessment` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Assessment" ALTER COLUMN "dueDate" SET NOT NULL;
