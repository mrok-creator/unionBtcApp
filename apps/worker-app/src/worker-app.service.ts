import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Metrics } from './shared/interface/metrics';

@Injectable()
export class WorkerAppService {
  private prisma: PrismaClient = new PrismaClient();
  constructor() {}
  async storeRate(rate: number) {
    await this.prisma.rate.create({
      data: {
        rate,
      },
    });
  }

  async storeCounterMetrics(metrics: Metrics) {
    await this.prisma.metrics.create({
      data: {
        email_subscribed: metrics.email_subscribed,
        email_unsubscribed: metrics.email_unsubscribed,
        email_sent: metrics.email_sent,
        email_error: metrics.email_error,
        exchange_rate: metrics.exchange_rate,
      },
    });
  }
}
