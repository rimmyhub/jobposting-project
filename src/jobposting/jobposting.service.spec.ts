import { Test, TestingModule } from '@nestjs/testing';
import { JobpostingService } from './jobposting.service';

describe('JobpostingsService', () => {
  let service: JobpostingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobpostingService],
    }).compile();

    service = module.get<JobpostingService>(JobpostingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
