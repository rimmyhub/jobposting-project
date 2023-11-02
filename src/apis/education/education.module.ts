import { Module } from '@nestjs/common';
import { EducationService } from './education.service';
import { EducationController } from './education.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Education } from '../domain/education.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Education])],
  controllers: [EducationController],
  providers: [EducationService],
  exports: [EducationService, TypeOrmModule],
})
export class EducationModule {}
