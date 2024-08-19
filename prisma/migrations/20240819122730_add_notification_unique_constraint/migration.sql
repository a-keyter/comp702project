/*
  Warnings:

  - A unique constraint covering the columns `[type,issueId,senderId,recipientId]` on the table `Notification` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Notification_type_issueId_senderId_recipientId_key" ON "Notification"("type", "issueId", "senderId", "recipientId");
