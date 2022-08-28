/*
  Warnings:

  - Changed the type of `eatenAt` on the `FoodEntries` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- AlterTable
ALTER TABLE "FoodEntries" DROP COLUMN "eatenAt",
ADD COLUMN     "eatenAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "dailyCalorieLimit" INTEGER NOT NULL DEFAULT 2100,
ADD COLUMN     "role" "Role" DEFAULT 'USER';
