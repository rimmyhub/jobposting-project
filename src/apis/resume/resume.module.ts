import { Module } from '@nestjs/common';
import { ResumeService } from './resume.service';
import { ResumeController } from './resumes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resume } from '../domain/resume.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Resume])],
  controllers: [ResumeController],
  providers: [ResumeService],
  exports: [ResumeService],
})
export class ResumeModule {}
