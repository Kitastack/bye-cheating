/*
  Warnings:

  - Added the required column `reportId` to the `ReportItems` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ReportItems" ADD COLUMN     "reportId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ReportItems" ADD CONSTRAINT "ReportItems_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
