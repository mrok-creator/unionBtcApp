import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as sgMail from '@sendgrid/mail';
import axios from 'axios';
import { MetricService } from '../metric/metric.service';
import * as process from 'process';

@Injectable()
export class RateService {
  private prisma: PrismaClient;
  private emailsSent: string[] = [];

  constructor(private readonly metricsService: MetricService) {
    this.prisma = new PrismaClient();
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async getCurrentRate(): Promise<number> {
    try {
      // Update the URL to use 'https'
      const { data } = await axios.get(
        'https://api.binance.com/api/v3/ticker/price?symbol=BTCUAH',
      );
      const { price } = data;
      const currentRate = parseInt(price);

      if (!currentRate || isNaN(currentRate) || currentRate < 0) {
        throw new Error('Invalid exchange rate value');
      }
      this.metricsService.setRateGaugeValue(currentRate);
      await axios.post(`http://localhost:8090/rate`, { currentRate });

      return currentRate;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async sendRateEmails(): Promise<string[]> {
    const subscribedEmails = await this.prisma.email.findMany({
      where: {
        subscribed: true,
      },
    });
    const rate = await this.getCurrentRate();
    const emailText = `The current BTC UAH rate is ${rate}`;

    for (const email of subscribedEmails) {
      await this.sendEmail(email.email, 'Current BTC UAH Rate', emailText);
    }

    return this.emailsSent;
  }

  private async sendEmail(
    to: string,
    subject: string,
    text: string,
  ): Promise<void> {
    const msg = {
      to,
      from: process.env.MAIL_SENDER,
      subject,
      text,
    };

    try {
      await sgMail.send(msg);
      this.emailsSent.push(to);
      this.metricsService.incrementEmailSentCounter();
    } catch (error) {
      this.metricsService.incrementEmailErrorCounter();
    }
  }
}
