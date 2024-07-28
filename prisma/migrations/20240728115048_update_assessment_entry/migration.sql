/*
  Warnings:

  - You are about to drop the column `description` on the `Assessment` table. All the data in the column will be lost.
  - Added the required column `objectives` to the `Assessment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Assessment" DROP COLUMN "description",
ADD COLUMN     "objectives" TEXT NOT NULL;
