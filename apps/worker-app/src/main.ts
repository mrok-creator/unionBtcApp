import { NestFactory } from '@nestjs/core';
import { WorkerAppModule } from './worker-app.module';
import pino from 'pino';
import { RequestIdMiddleware } from '@app/lib/middlewares/request-id.middleware';

async function bootstrap() {
  const logger = pino();
  const app = await NestFactory.create(WorkerAppModule);
  app.enableCors();
  app.use(new RequestIdMiddleware().use);
  const PORT = process.env.WORKER_PORT || 8090;
  await app.listen(PORT);
  logger.info({}, `Application is running on: ${await app.getUrl()}`);
}
bootstrap();
