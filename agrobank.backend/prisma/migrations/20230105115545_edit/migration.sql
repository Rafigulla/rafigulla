/*
  Warnings:

  - You are about to drop the column `step_list` on the `creditInfo` table. All the data in the column will be lost.
  - You are about to drop the column `step_title` on the `creditInfo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "credit" ADD COLUMN     "conditions_file" TEXT,
ADD COLUMN     "documents_file" TEXT,
ADD COLUMN     "step_list" JSONB,
ADD COLUMN     "step_title" JSONB;

-- AlterTable
ALTER TABLE "creditInfo" DROP COLUMN "step_list",
DROP COLUMN "step_title";
