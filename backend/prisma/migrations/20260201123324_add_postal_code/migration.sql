/*
  Warnings:

  - A unique constraint covering the columns `[postalCode]` on the table `Neighbourhood` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Neighbourhood" ADD COLUMN     "postalCode" TEXT NOT NULL DEFAULT '00000';

-- CreateIndex
CREATE UNIQUE INDEX "Neighbourhood_postalCode_key" ON "Neighbourhood"("postalCode");
