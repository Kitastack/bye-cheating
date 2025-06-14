-- AlterTable
ALTER TABLE "user" ADD COLUMN     "roles" TEXT[] DEFAULT ARRAY[]::TEXT[];
