/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `admins` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "admins_uuid_key" ON "admins"("uuid");
