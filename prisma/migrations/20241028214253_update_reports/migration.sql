/*
  Warnings:

  - Changed the type of `reason` on the `Report` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ReportReason" AS ENUM ('SPAM', 'ADVERTISING', 'FRAUD', 'FINANCIAL_MANIPULATION', 'INAPPROPRIATE', 'HARASSMENT', 'MISINFORMATION', 'COPYRIGHT_VIOLATION', 'OFF_TOPIC', 'OTHER');

-- AlterTable
ALTER TABLE "Report" DROP COLUMN "reason",
ADD COLUMN     "reason" "ReportReason" NOT NULL;
