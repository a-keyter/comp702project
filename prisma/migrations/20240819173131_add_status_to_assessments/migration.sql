-- CreateEnum
CREATE TYPE "AssessmentStatus" AS ENUM ('DRAFT', 'LIVE');

-- AlterTable
ALTER TABLE "Assessment" ADD COLUMN     "status" "AssessmentStatus" NOT NULL DEFAULT 'DRAFT';
