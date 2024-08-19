/*
  Warnings:

  - Added the required column `is_unread` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "is_unread" BOOLEAN NOT NULL;
