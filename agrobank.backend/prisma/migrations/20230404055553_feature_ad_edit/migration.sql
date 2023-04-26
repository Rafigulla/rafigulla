/*
  Warnings:

  - Added the required column `bg_color` to the `featured_ad` table without a default value. This is not possible if the table is not empty.
  - Added the required column `color` to the `featured_ad` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `title` on the `featured_ad` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `description` on the `featured_ad` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `link` on the `featured_ad` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "featured_ad" ADD COLUMN     "bg_color" TEXT NOT NULL,
ADD COLUMN     "color" TEXT NOT NULL,
DROP COLUMN "title",
ADD COLUMN     "title" JSONB NOT NULL,
DROP COLUMN "description",
ADD COLUMN     "description" JSONB NOT NULL,
DROP COLUMN "link",
ADD COLUMN     "link" JSONB NOT NULL;
