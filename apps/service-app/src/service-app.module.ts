import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { RateController } from './controllers/rate/rate.controller';
import { RateService } from './services/rate/rate.service';
import { SubscriptionController } from './controllers/subscription/subscription.controller';
import { SubscriptionService } from './services/subscription/subscription.service';
import { MetricController } from './controllers/metric/metric.controller';
import { MetricService } from './services/metric/metric.service';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        safe: true,
        level: process.env.LOG_LEVEL || 'info',
        base: null,
        formatters: {
          level: (label: string) => ({ level: label }),
        },
      },
    }),
  ],
  controllers: [RateController, SubscriptionController, MetricController],
  providers: [MetricService, RateService, SubscriptionService],
})
export class ServiceAppModule {}
