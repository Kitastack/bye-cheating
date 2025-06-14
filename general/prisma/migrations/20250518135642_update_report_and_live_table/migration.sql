/*
  Warnings:

  - You are about to drop the column `liveId` on the `report` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "report" DROP CONSTRAINT "report_liveId_fkey";

-- AlterTable
ALTER TABLE "live" ADD COLUMN     "reportId" TEXT;

-- AlterTable
ALTER TABLE "report" DROP COLUMN "liveId";

-- AddForeignKey
ALTER TABLE "live" ADD CONSTRAINT "live_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "report"("id") ON DELETE SET NULL ON UPDATE CASCADE;
