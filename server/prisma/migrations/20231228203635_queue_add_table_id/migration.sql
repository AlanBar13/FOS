/*
  Warnings:

  - Added the required column `tableId` to the `KitchenQueue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "KitchenQueue" ADD COLUMN     "tableId" INTEGER NOT NULL;
