-- CreateTable
CREATE TABLE "FavoriteStock" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "ticker" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FavoriteStock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FavoriteStock_userId_ticker_key" ON "FavoriteStock"("userId", "ticker");

-- AddForeignKey
ALTER TABLE "FavoriteStock" ADD CONSTRAINT "FavoriteStock_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
