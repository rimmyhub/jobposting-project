import { Test, TestingModule } from '@nestjs/testing';
import { JobpostingsService } from './jobpostings.service';

describe('JobpostingsService', () => {
  let service: JobpostingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobpostingsService],
    }).compile();

    service = module.get<JobpostingsService>(JobpostingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
