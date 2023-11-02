import { Controller, Post } from '@nestjs/common';
import { Job } from 'src/utils/job.interface';
import { JobcrawlerService } from './jobcrawler.service';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('api/jobcrawler')
@ApiTags('크롤링 API')
export class JobcrawlerController {
  constructor(private readonly jobcrawlerService: JobcrawlerService) {}

  // 채용공고 크롤링
  @Post()
  @ApiOperation({
    summary: '채용공고 크롤링 API',
    description: '채용공고 크롤링',
  })
  @ApiCreatedResponse({ description: '채용공고 크롤링' })
  async jobJobs() {
    const jobs = await this.jobcrawlerService.incruitCrawling();
    return jobs;
  }
}
