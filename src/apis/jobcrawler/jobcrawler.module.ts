import { Module } from '@nestjs/common';
import { JobcrawlerService } from './jobcrawler.service';
import { JobcrawlerController } from './jobcrawler.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Jobposting } from '../domain/jobposting.entity';
import { Company } from '../domain/company.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Jobposting, Company]),
  ],
  controllers: [JobcrawlerController],
  providers: [JobcrawlerService],
})
export class JobcrawlerModule {}
