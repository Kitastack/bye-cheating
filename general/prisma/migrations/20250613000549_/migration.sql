/*
  Warnings:

  - You are about to drop the column `expiryTime` on the `live` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "live" DROP COLUMN "expiryTime",
ADD COLUMN     "expiryTimeInMinutes" INTEGER;
