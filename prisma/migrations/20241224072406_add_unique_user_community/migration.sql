/*
  Warnings:

  - A unique constraint covering the columns `[userId,communityId]` on the table `UserCommunity` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserCommunity_userId_communityId_key" ON "UserCommunity"("userId", "communityId");
