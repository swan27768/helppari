/*
  Warnings:

  - You are about to drop the column `isActive` on the `Neighbourhood` table. All the data in the column will be lost.
  - You are about to drop the column `postalCode` on the `Neighbourhood` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Neighbourhood" DROP COLUMN "isActive",
DROP COLUMN "postalCode";

-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "status" SET DEFAULT 'active';

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "body" TEXT NOT NULL,
    "postId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
