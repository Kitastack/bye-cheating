/*
  Warnings:

  - You are about to drop the column `url` on the `live` table. All the data in the column will be lost.
  - Added the required column `path` to the `live` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "live" RENAME COLUMN "url" TO "path";
