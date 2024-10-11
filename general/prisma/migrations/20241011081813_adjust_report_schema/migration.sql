/*
  Warnings:

  - You are about to drop the column `frame` on the `ReportItems` table. All the data in the column will be lost.
  - You are about to drop the column `labels` on the `ReportItems` table. All the data in the column will be lost.
  - You are about to drop the column `originalFrame` on the `ReportItems` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "contentType" TEXT NOT NULL DEFAULT 'image/jpeg',
ADD COLUMN     "time" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "ReportItems" DROP COLUMN "frame",
DROP COLUMN "labels",
DROP COLUMN "originalFrame",
ADD COLUMN     "data" JSONB,
ADD COLUMN     "frameUrl" TEXT,
ADD COLUMN     "rawFrameUrl" TEXT;
