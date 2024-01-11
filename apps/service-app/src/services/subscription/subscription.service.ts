import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClient, Email } from '@prisma/client';
import { MetricService } from '../metric/metric.service';

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
    const existingEmail = await this.prisma.email.upsert({
      where: { email },
      create: { email, subscribed: true },
      update: { subscribed: true },
    });

    if (existingEmail.subscribed) {
      throw new ConflictException('E-mail already exists and is subscribed');
    }

    this.metricsService.incrementEmailSubscribedCounter();

    return existingEmail;
  }

  async unsubscribeEmail(email: string): Promise<Email> {
    const existingEmail = await this.prisma.email.upsert({
      where: { email },
      create: { email, subscribed: false },
      update: { subscribed: false },
    });

    if (!existingEmail.subscribed) {
      throw new NotFoundException('E-mail not found');
    }

    this.metricsService.incrementEmailUnsubscribedCounter();

    return existingEmail;
  }
}
