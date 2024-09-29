-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Admin', 'Super Admin');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('On Going', 'Completed');

-- CreateTable
CREATE TABLE "User" (
    "_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT,
    "password" TEXT NOT NULL,
    "roles" "Role"[] DEFAULT ARRAY[]::"Role"[],
    "_createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "_updatedDate" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Stream" (
    "_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "_createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "_updatedDate" TIMESTAMP(3),
    "userId" TEXT NOT NULL,

    CONSTRAINT "Stream_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Report" (
    "_id" TEXT NOT NULL,
    "streamId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "isFrameStored" BOOLEAN NOT NULL DEFAULT false,
    "_createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "_updatedDate" TIMESTAMP(3),

    CONSTRAINT "Report_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "ReportItems" (
    "_id" TEXT NOT NULL,
    "labels" JSONB,
    "frame" TEXT,
    "originalFrame" TEXT,
    "_createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "_updatedDate" TIMESTAMP(3),

    CONSTRAINT "ReportItems_pkey" PRIMARY KEY ("_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Stream" ADD CONSTRAINT "Stream_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_streamId_fkey" FOREIGN KEY ("streamId") REFERENCES "Stream"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
