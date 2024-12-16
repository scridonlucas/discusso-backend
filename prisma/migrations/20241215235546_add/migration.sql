/*
  Warnings:

  - You are about to drop the column `moderatorId` on the `ModerationLog` table. All the data in the column will be lost.
  - Added the required column `adminId` to the `ModerationLog` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ModerationLog" DROP CONSTRAINT "ModerationLog_moderatorId_fkey";

-- DropIndex
DROP INDEX "ModerationLog_moderatorId_idx";

-- AlterTable
ALTER TABLE "ModerationLog" DROP COLUMN "moderatorId",
ADD COLUMN     "adminId" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "ModerationLog_adminId_idx" ON "ModerationLog"("adminId");

-- AddForeignKey
ALTER TABLE "ModerationLog" ADD CONSTRAINT "ModerationLog_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
