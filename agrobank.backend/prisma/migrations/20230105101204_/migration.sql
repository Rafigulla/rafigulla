/*
  Warnings:

  - You are about to drop the `Credit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CreditInfo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CreditInfo" DROP CONSTRAINT "CreditInfo_creditId_fkey";

-- DropTable
DROP TABLE "Credit";

-- DropTable
DROP TABLE "CreditInfo";

-- CreateTable
CREATE TABLE "credit" (
    "id" SERIAL NOT NULL,
    "name" JSONB,
    "info" JSONB,
    "term" TEXT,
    "icon" TEXT,
    "min_summa" TEXT,
    "max_summa" TEXT,
    "initial_fee" TEXT,
    "percentage" TEXT,
    "min_initial_fee" TEXT,
    "type" TEXT,

    CONSTRAINT "credit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "creditInfo" (
    "id" SERIAL NOT NULL,
    "titles" JSONB,
    "info" JSONB,
    "creditId" INTEGER NOT NULL,
    "step_title" TEXT,
    "step_list" JSONB NOT NULL,

    CONSTRAINT "creditInfo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "creditInfo" ADD CONSTRAINT "creditInfo_creditId_fkey" FOREIGN KEY ("creditId") REFERENCES "credit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
