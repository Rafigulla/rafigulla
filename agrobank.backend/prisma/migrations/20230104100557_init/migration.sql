-- CreateTable
CREATE TABLE "Credit" (
    "id" SERIAL NOT NULL,
    "name" JSONB,
    "info" JSONB,
    "term" TEXT,
    "icon" TEXT,
    "summa" TEXT,
    "initial_fee" TEXT,
    "percentage" TEXT,

    CONSTRAINT "Credit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreditInfo" (
    "id" SERIAL NOT NULL,
    "titles" JSONB,
    "info" JSONB,
    "creditId" INTEGER NOT NULL,

    CONSTRAINT "CreditInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CreditInfo_creditId_key" ON "CreditInfo"("creditId");

-- AddForeignKey
ALTER TABLE "CreditInfo" ADD CONSTRAINT "CreditInfo_creditId_fkey" FOREIGN KEY ("creditId") REFERENCES "Credit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
