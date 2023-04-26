-- AlterTable
ALTER TABLE "Credit" ADD COLUMN     "type" TEXT;

-- CreateTable
CREATE TABLE "message_list" (
    "id" SERIAL NOT NULL,
    "message" JSONB,
    "module_name" TEXT,

    CONSTRAINT "message_list_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "error_list" (
    "id" SERIAL NOT NULL,
    "error_message" JSONB,
    "module_name" TEXT,
    "error_code" SERIAL NOT NULL,

    CONSTRAINT "error_list_pkey" PRIMARY KEY ("id")
);

ALTER SEQUENCE "error_list_error_code_seq" RESTART WITH 1001
