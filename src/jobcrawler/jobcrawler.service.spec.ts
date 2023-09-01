import { Test, TestingModule } from '@nestjs/testing';
import { JobcrawlerService } from './jobcrawler.service';

describe('JobcrawlerService', () => {
  let service: JobcrawlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobcrawlerService],
    }).compile();

    service = module.get<JobcrawlerService>(JobcrawlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
