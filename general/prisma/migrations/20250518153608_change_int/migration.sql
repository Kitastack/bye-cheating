/*
  Warnings:

  - You are about to alter the column `expiryTime` on the `live` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "live" ALTER COLUMN "expiryTime" SET DATA TYPE INTEGER;
