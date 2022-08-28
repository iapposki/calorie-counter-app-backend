/*
  Warnings:

  - You are about to drop the `FoodCatalogue` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `eatenAt` to the `FoodEntries` table without a default value. This is not possible if the table is not empty.
  - Made the column `userId` on table `FoodEntries` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "FoodEntries" DROP CONSTRAINT "FoodEntries_userId_fkey";

-- AlterTable
ALTER TABLE "FoodEntries" ADD COLUMN     "eatenAt" TEXT NOT NULL,
ALTER COLUMN "userId" SET NOT NULL;

-- DropTable
DROP TABLE "FoodCatalogue";

-- AddForeignKey
ALTER TABLE "FoodEntries" ADD CONSTRAINT "FoodEntries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
