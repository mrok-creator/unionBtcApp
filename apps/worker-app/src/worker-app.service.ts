import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Metrics } from './shared/interface/metrics';

@Injectable()
export class WorkerAppService {
  constructor(private readonly prisma: PrismaClient) {}
  async storeRate(rate: number) {
    await this.prisma.rate.create({
      data: {
        rate,
      },
    });
  }

  async storeCounterMetrics(prometheusString: string) {
    const metrics: Metrics = await this.parsePrometheusString(prometheusString);

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

  async parsePrometheusString(prometheusString: string): Promise<Metrics> {
    const keyValuePairs = prometheusString.split(',');

    return await keyValuePairs.reduce(async (accPromise, pair) => {
      const acc = await accPromise;
      const [key, value] = pair.split('=');

      switch (key) {
        case 'email_subscribed':
        case 'email_unsubscribed':
        case 'email_sent':
        case 'email_error':
        case 'exchange_rate':
          acc[key] = parseInt(value, 10);
          break;
      }

      return acc;
    }, Promise.resolve({}));
  }
}
