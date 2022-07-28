/*
  Warnings:

  - You are about to drop the `Food` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FoodToEnter` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FoodToEnter" DROP CONSTRAINT "FoodToEnter_userId_fkey";

-- DropTable
DROP TABLE "Food";

-- DropTable
DROP TABLE "FoodToEnter";

-- CreateTable
CREATE TABLE "FoodCatalogue" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "calories" INTEGER NOT NULL,
    "vegetarian" BOOLEAN NOT NULL,

    CONSTRAINT "FoodCatalogue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FoodEntries" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "calories" INTEGER NOT NULL,
    "vegetarian" BOOLEAN NOT NULL,
    "addedAt" TIMESTAMP(3),
    "userId" INTEGER,

    CONSTRAINT "FoodEntries_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FoodEntries" ADD CONSTRAINT "FoodEntries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
