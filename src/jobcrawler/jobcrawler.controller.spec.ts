import { Test, TestingModule } from '@nestjs/testing';
import { JobcrawlerController } from './jobcrawler.controller';
import { JobcrawlerService } from './jobcrawler.service';

describe('JobcrawlerController', () => {
  let controller: JobcrawlerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobcrawlerController],
      providers: [JobcrawlerService],
    }).compile();

    controller = module.get<JobcrawlerController>(JobcrawlerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
