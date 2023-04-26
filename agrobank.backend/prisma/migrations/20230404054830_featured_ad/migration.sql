-- CreateTable
CREATE TABLE "featured_ad" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "chips" JSONB NOT NULL,
    "link" TEXT NOT NULL,

    CONSTRAINT "featured_ad_pkey" PRIMARY KEY ("id")
);
