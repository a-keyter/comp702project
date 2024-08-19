/*
  Warnings:

  - The values [CLASS_JOIN_REQUEST_UPDATE] on the enum `NotificationType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "NotificationType_new" AS ENUM ('NEW_ASSESSMENT', 'CLASS_JOIN_REQUEST', 'CLASS_JOIN_REJECTED', 'CLASS_JOIN_ACCEPTED', 'FEEDBACK_ISSUE_RAISED', 'QUESTION_ISSUE_RAISED', 'NEW_ISSUE_MESSAGE');
ALTER TABLE "Notification" ALTER COLUMN "type" TYPE "NotificationType_new" USING ("type"::text::"NotificationType_new");
ALTER TYPE "NotificationType" RENAME TO "NotificationType_old";
ALTER TYPE "NotificationType_new" RENAME TO "NotificationType";
DROP TYPE "NotificationType_old";
COMMIT;
