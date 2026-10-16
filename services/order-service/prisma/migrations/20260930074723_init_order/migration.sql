-- CreateTable
CREATE TABLE "orders" (
    "oid" SERIAL NOT NULL,
    "uid" INTEGER NOT NULL,
    "discount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "total_amount" DECIMAL(14,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("oid")
);

-- CreateTable
CREATE TABLE "order_details" (
    "oid" INTEGER NOT NULL,
    "pid" INTEGER NOT NULL,
    "qty" INTEGER NOT NULL,
    "unit_price" DECIMAL(14,2) NOT NULL,

    CONSTRAINT "order_details_pkey" PRIMARY KEY ("oid","pid")
);

-- CreateIndex
CREATE INDEX "orders_uid_idx" ON "orders"("uid");

-- AddForeignKey
ALTER TABLE "order_details" ADD CONSTRAINT "order_details_oid_fkey" FOREIGN KEY ("oid") REFERENCES "orders"("oid") ON DELETE CASCADE ON UPDATE CASCADE;
