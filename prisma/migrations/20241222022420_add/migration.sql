/*
  Warnings:

  - You are about to drop the column `trendingPoints` on the `Discussion` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Discussion" DROP COLUMN "trendingPoints",
ADD COLUMN     "trendingScore" DOUBLE PRECISION NOT NULL DEFAULT 0;
