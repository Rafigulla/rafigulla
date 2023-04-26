/*
  Warnings:

  - You are about to drop the column `summa` on the `Credit` table. All the data in the column will be lost.
  - Added the required column `step_list` to the `CreditInfo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Credit" DROP COLUMN "summa",
ADD COLUMN     "max_summa" TEXT,
ADD COLUMN     "min_initial_fee" TEXT,
ADD COLUMN     "min_summa" TEXT;

-- AlterTable
ALTER TABLE "CreditInfo" ADD COLUMN     "step_list" JSONB NOT NULL,
ADD COLUMN     "step_title" TEXT;

-- AlterTable
ALTER TABLE "message_list" ADD COLUMN     "lang" TEXT;
