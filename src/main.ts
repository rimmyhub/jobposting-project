import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join, resolve } from 'path';
import { HttpExceptionFilter } from './commons/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(cookieParser()); //
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter()); //ExceptionFilter

  app.setBaseViewsDir(resolve('./views'));
  app.useStaticAssets(resolve('./views/public'));
  app.setViewEngine('ejs');
  await app.listen(3000);
}
bootstrap();
