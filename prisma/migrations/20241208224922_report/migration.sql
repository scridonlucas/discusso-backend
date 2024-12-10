/*
  Warnings:

  - You are about to drop the `Report` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_discussionId_fkey";

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_userId_fkey";

-- DropTable
DROP TABLE "Report";

-- CreateTable
CREATE TABLE "DiscussionReport" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "discussionId" INTEGER NOT NULL,
    "reason" "ReportReason" NOT NULL,
    "status" "ReportStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),

    CONSTRAINT "DiscussionReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DiscussionReport_userId_idx" ON "DiscussionReport"("userId");

-- CreateIndex
CREATE INDEX "DiscussionReport_discussionId_idx" ON "DiscussionReport"("discussionId");

-- AddForeignKey
ALTER TABLE "DiscussionReport" ADD CONSTRAINT "DiscussionReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussionReport" ADD CONSTRAINT "DiscussionReport_discussionId_fkey" FOREIGN KEY ("discussionId") REFERENCES "Discussion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
