-- CreateEnum
CREATE TYPE "enum_Kitchen_Status" AS ENUM ('ordered', 'preparing', 'done');

-- AlterTable
ALTER TABLE "KitchenQueue" ADD COLUMN     "status" "enum_Kitchen_Status" NOT NULL DEFAULT 'ordered';

-- AddForeignKey
ALTER TABLE "KitchenQueue" ADD CONSTRAINT "KitchenQueue_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
