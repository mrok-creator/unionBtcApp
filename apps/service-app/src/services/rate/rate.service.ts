import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import * as sgMail from '@sendgrid/mail';
import axios from 'axios';
import { MetricService } from '../metric/metric.service';

@Injectable()
export class RateService {
  private prisma: PrismaClient;

  constructor(private readonly metricsService: MetricService) {
    this.prisma = new PrismaClient();
  }

  async getCurrentRate(): Promise<number> {
    const { data } = await axios.get(process.env.URL_API_BTC_TO_UAH_RATE);
    const { price } = data.json();
    const currentRate = parseInt(price);

    if (!currentRate || isNaN(currentRate) || currentRate < 0)
      throw new Error('Invalid exchange rate value');

    this.metricsService.setRateGaugeValue(currentRate);

    await axios.post(`http://localhost:8090/rate`, { currentRate });

    return currentRate;
  }

  async sendRateEmails(): Promise<string[]> {
    const subscribedEmails = await this.prisma.email.findMany({
      where: {
        subscribed: true,
      } as Prisma.EmailWhereInput,
    });
    const emailsSent: string[] = [];
    const rate = await this.getCurrentRate();

    for (const email of subscribedEmails) {
      try {
        const msg = {
          to: email.email,
          from: 'juniorseniors.dev@gmail.com',
          subject: 'Current BTC UAH Rate',
          text: `The current BTC UAH rate is ${rate}`,
        };

        await sgMail.send(msg);
        emailsSent.push(email.email);
        this.metricsService.incrementEmailSentCounter();
      } catch (error) {
        this.metricsService.incrementEmailErrorCounter();
      }
    }

    return emailsSent;
  }
}
