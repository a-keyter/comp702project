-- DropForeignKey
ALTER TABLE "Assessment" DROP CONSTRAINT "Assessment_classId_fkey";

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;
