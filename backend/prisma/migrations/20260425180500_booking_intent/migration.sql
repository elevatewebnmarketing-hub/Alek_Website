-- CreateEnum
CREATE TYPE "BookingPaymentScope" AS ENUM ('one_time_item', 'full_package_full', 'full_package_instalments');

-- CreateTable
CREATE TABLE "BookingIntent" (
    "id" TEXT NOT NULL,
    "packageSlug" TEXT NOT NULL,
    "paymentScope" "BookingPaymentScope" NOT NULL,
    "contactEmail" TEXT,
    "notes" TEXT,
    "pricingSnapshot" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BookingIntent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BookingIntent_packageSlug_createdAt_idx" ON "BookingIntent"("packageSlug", "createdAt");

-- CreateIndex
CREATE INDEX "BookingIntent_createdAt_idx" ON "BookingIntent"("createdAt");
