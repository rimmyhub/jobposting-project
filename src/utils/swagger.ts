import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function swaggerSetting(app: INestApplication): void {
  const options = new DocumentBuilder()
    .setTitle('NestJS Winner API Docs')
    .setDescription('NestJS Winner API Description')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-winner', app, document);
}
