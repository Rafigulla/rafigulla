/*
  Warnings:

  - Changed the type of `tran_date` on the `humo` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `tran_date` on the `uzcard` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "humo" DROP COLUMN "tran_date",
ADD COLUMN     "tran_date" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "uzcard" DROP COLUMN "tran_date",
ADD COLUMN     "tran_date" TIMESTAMP(3) NOT NULL;
