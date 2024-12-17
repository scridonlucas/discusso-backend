-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Discussion" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;
