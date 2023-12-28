-- CreateTable
CREATE TABLE "KitchenQueue" (
    "uuid" TEXT NOT NULL,
    "orderId" INTEGER NOT NULL,
    "ready" BOOLEAN NOT NULL,
    "orderedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "inKitchenAt" TIMESTAMPTZ(6),
    "doneAt" TIMESTAMPTZ(6),

    CONSTRAINT "KitchenQueue_pkey" PRIMARY KEY ("uuid")
);
