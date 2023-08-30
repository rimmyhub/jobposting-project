import { Controller, Get, Post } from '@nestjs/common';
import { JobcrawlerService } from './jobcrawler.service';
import { Job } from 'src/utils/job.interface';

@Controller('api/jobcrawler')
export class JobcrawlerController {
  constructor(private readonly jobcrawlerService: JobcrawlerService) {}

  // 채용공고 크롤링
  @Post()
  async jobJobs() {
    const jobs = await this.jobcrawlerService.crawlJobs();
    return jobs;
  }
}
