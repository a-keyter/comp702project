/*
  Warnings:

  - You are about to drop the column `createdById` on the `Class` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_createdById_fkey";

-- AlterTable
ALTER TABLE "Class" DROP COLUMN "createdById";

-- CreateTable
CREATE TABLE "_TaughtBy" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_TaughtBy_AB_unique" ON "_TaughtBy"("A", "B");

-- CreateIndex
CREATE INDEX "_TaughtBy_B_index" ON "_TaughtBy"("B");

-- AddForeignKey
ALTER TABLE "_TaughtBy" ADD CONSTRAINT "_TaughtBy_A_fkey" FOREIGN KEY ("A") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TaughtBy" ADD CONSTRAINT "_TaughtBy_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
