/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `Menu` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Menu" DROP COLUMN "deletedAt";

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "deletedAt";

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "deletedAt";
