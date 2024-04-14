/*
  Warnings:

  - A unique constraint covering the columns `[categoryId]` on the table `Menu` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `categoryId` to the `Menu` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Menu" ADD COLUMN     "categoryId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Categories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Menu_categoryId_key" ON "Menu"("categoryId");

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
