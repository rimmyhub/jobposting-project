import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from 'commons/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter()); //ExceptionFilter
  app.use(cookieParser()); //
  await app.listen(3000);
}
bootstrap();
