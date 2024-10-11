/*
  Warnings:

  - You are about to drop the column `frameUrl` on the `ReportItems` table. All the data in the column will be lost.
  - You are about to drop the column `rawFrameUrl` on the `ReportItems` table. All the data in the column will be lost.
  - Added the required column `thumbnailUrl` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "recordUrl" TEXT,
ADD COLUMN     "thumbnailUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ReportItems" DROP COLUMN "frameUrl",
DROP COLUMN "rawFrameUrl";
