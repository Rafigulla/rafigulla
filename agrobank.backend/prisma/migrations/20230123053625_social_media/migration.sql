-- CreateTable
CREATE TABLE "settings" (
    "id" SERIAL NOT NULL,
    "phone_numbers" JSONB NOT NULL,
    "social_media" JSONB NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);
