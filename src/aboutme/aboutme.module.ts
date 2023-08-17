import { Module } from '@nestjs/common';
import { AboutmeService } from './aboutme.service';
import { AboutmeController } from './aboutme.controller';

@Module({
  controllers: [AboutmeController],
  providers: [AboutmeService],
})
export class AboutmeModule {}
