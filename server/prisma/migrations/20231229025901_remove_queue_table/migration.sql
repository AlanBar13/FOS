/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the `KitchenQueue` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "KitchenQueue" DROP CONSTRAINT "KitchenQueue_orderId_fkey";

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "updatedAt",
ADD COLUMN     "doneAt" TIMESTAMPTZ(6),
ADD COLUMN     "inKitchenAt" TIMESTAMPTZ(6),
ALTER COLUMN "status" SET DEFAULT 'ordered';

-- DropTable
DROP TABLE "KitchenQueue";

-- DropEnum
DROP TYPE "enum_Kitchen_Status";
