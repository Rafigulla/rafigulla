/*
  Warnings:

  - Added the required column `tran_date` to the `humo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tran_date` to the `uzcard` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "humo" ADD COLUMN     "tran_date" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "uzcard" ADD COLUMN     "tran_date" TIMESTAMP(3) NOT NULL;
