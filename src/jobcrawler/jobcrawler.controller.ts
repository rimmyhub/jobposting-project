import { Controller, Post } from '@nestjs/common';
import { Job } from 'src/utils/job.interface';
import { JobcrawlerService } from './jobcrawler.service';

@Controller('api/jobcrawler')
export class JobcrawlerController {
  constructor(private readonly jobcrawlerService: JobcrawlerService) {}

  // 채용공고 크롤링
  @Post()
  async jobJobs() {
    const jobs = await this.jobcrawlerService.inflearnCrawling();
    return jobs;
  }
}
