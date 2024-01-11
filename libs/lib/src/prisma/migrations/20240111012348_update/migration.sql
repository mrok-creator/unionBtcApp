-- CreateTable
CREATE TABLE "Metrics" (
    "id" SERIAL NOT NULL,
    "email_subscribed" INTEGER NOT NULL,
    "email_unsubscribed" INTEGER NOT NULL,
    "email_sent" INTEGER NOT NULL,
    "email_error" INTEGER NOT NULL,
    "exchange_rate" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Metrics_pkey" PRIMARY KEY ("id")
);
