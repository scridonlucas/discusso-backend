/*
  Warnings:

  - The values [INAPPROPRIATE,COPYRIGHT_VIOLATION] on the enum `ReportReason` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ReportReason_new" AS ENUM ('SPAM', 'ADVERTISING', 'FRAUD', 'FINANCIAL_MANIPULATION', 'MISINFORMATION', 'INAPPROPRIATE_CONTENT', 'HARASSMENT', 'WRONG_COMMUNITY', 'OFF_TOPIC', 'OTHER');
ALTER TABLE "DiscussionReport" ALTER COLUMN "reason" TYPE "ReportReason_new" USING ("reason"::text::"ReportReason_new");
ALTER TABLE "CommentReport" ALTER COLUMN "reason" TYPE "ReportReason_new" USING ("reason"::text::"ReportReason_new");
ALTER TYPE "ReportReason" RENAME TO "ReportReason_old";
ALTER TYPE "ReportReason_new" RENAME TO "ReportReason";
DROP TYPE "ReportReason_old";
COMMIT;
