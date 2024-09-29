/*
  Warnings:

  - You are about to drop the column `userId` on the `Authentication` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Authentication" DROP CONSTRAINT "Authentication_userId_fkey";

-- AlterTable
ALTER TABLE "Authentication" DROP COLUMN "userId";

-- AddForeignKey
ALTER TABLE "Authentication" ADD CONSTRAINT "Authentication__id_fkey" FOREIGN KEY ("_id") REFERENCES "User"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
