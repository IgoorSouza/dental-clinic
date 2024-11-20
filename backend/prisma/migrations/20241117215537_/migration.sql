/*
  Warnings:

  - Made the column `price` on table `schedules` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "schedules" ALTER COLUMN "price" SET NOT NULL;
