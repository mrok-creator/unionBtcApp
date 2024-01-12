import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { MetricService } from '../metric/metric.service';
import { Email } from '../../shared/model/email';

@Injectable()
export class SubscriptionService {
  private prisma: PrismaClient;
  constructor(private readonly metricsService: MetricService) {
    this.prisma = new PrismaClient();
  }

  async getAllEmails(): Promise<Email[]> {
    return this.prisma.email.findMany();
  }

  async subscribeEmail(email: string): Promise<Email> {
    const existingEmail = await this.prisma.email.findUnique({
      where: { email },
    });

    if (existingEmail) {
      this.validateSubscriptionStatus(existingEmail, true);

      const updatedEmail = await this.updateEmailSubscriptionStatus(
        email,
        true,
      );
      this.metricsService.incrementEmailSubscribedCounter();
      return updatedEmail;
    } else {
      const newEmail = await this.createEmail({ email, subscribed: true });
      this.metricsService.incrementEmailSubscribedCounter();
      return newEmail;
    }
  }

  async unsubscribeEmail(email: string): Promise<Email> {
    const existingEmail = await this.prisma.email.findUnique({
      where: { email },
    });

    if (!existingEmail) {
      throw new NotFoundException('E-mail not found');
    }

    this.validateSubscriptionStatus(existingEmail, false);

    const updatedEmail = await this.updateEmailSubscriptionStatus(email, false);
    this.metricsService.incrementEmailUnsubscribedCounter();
    return updatedEmail;
  }

  private validateSubscriptionStatus(
    email: Email,
    expectedStatus: boolean,
  ): void {
    if (email.subscribed === expectedStatus) {
      throw new ConflictException(
        `E-mail is already ${expectedStatus ? 'subscribed' : 'unsubscribed'}`,
      );
    }
  }

  private async updateEmailSubscriptionStatus(
    email: string,
    subscribed: boolean,
  ): Promise<Email> {
    return this.prisma.email.update({
      where: { email },
      data: { subscribed },
    });
  }

  private async createEmail(data: {
    email: string;
    subscribed: boolean;
  }): Promise<Email> {
    return this.prisma.email.create({ data });
  }
}
