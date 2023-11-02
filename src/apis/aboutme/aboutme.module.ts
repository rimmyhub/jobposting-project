import { Module } from '@nestjs/common';
import { AboutmeService } from './aboutme.service';
import { AboutmeController } from './aboutme.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aboutme } from '../domain/aboutme.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Aboutme])],
  controllers: [AboutmeController],
  providers: [AboutmeService],
})
export class AboutmeModule {}
