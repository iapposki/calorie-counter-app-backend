/*
  Warnings:

  - You are about to drop the column `addedAt` on the `Food` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Food` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Food" DROP CONSTRAINT "Food_userId_fkey";

-- AlterTable
ALTER TABLE "Food" DROP COLUMN "addedAt",
DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "FoodToEnter" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "calories" INTEGER NOT NULL,
    "vegetarian" BOOLEAN NOT NULL,
    "addedAt" TIMESTAMP(3),
    "userId" INTEGER,

    CONSTRAINT "FoodToEnter_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FoodToEnter" ADD CONSTRAINT "FoodToEnter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
