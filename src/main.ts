import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from 'commons/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter()); //ExceptionFilter
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(cookieParser()); //
  await app.listen(3000);
}
bootstrap();
