-- CreateTable
CREATE TABLE "WebPushSubscription" (
    "socketId" TEXT NOT NULL,
    "orderId" INTEGER NOT NULL,
    "subscription" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "WebPushSubscription_socketId_key" ON "WebPushSubscription"("socketId");

-- AddForeignKey
ALTER TABLE "WebPushSubscription" ADD CONSTRAINT "WebPushSubscription_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
