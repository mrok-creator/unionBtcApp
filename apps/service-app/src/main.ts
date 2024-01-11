import { NestFactory } from '@nestjs/core';
import { ServiceAppModule } from './service-app.module';
import { RequestIdMiddleware } from '@app/lib/middlewares/request-id.middleware';
import pino from 'pino';

async function bootstrap() {
  const logger = pino();
  const app = await NestFactory.create(ServiceAppModule);
  app.use(new RequestIdMiddleware().use);
  app.enableCors();
  const PORT = 8080;
  await app.listen(PORT);
  logger.info({}, `Application is running on: ${await app.getUrl()}`);
}
bootstrap();
