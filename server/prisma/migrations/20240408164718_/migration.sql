/*
  Warnings:

  - You are about to drop the column `category` on the `Menu` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Menu_categoryId_key";

-- AlterTable
ALTER TABLE "Menu" DROP COLUMN "category";
