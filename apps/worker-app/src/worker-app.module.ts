import { Module } from '@nestjs/common';
import { WorkerAppController } from './worker-app.controller';
import { WorkerAppService } from './worker-app.service';
import { LoggerModule } from 'nestjs-pino';

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
  controllers: [WorkerAppController],
  providers: [WorkerAppService],
})
export class WorkerAppModule {}
