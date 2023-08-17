import { Test, TestingModule } from '@nestjs/testing';
import { AboutmeService } from './aboutme.service';

describe('AboutmeService', () => {
  let service: AboutmeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AboutmeService],
    }).compile();

    service = module.get<AboutmeService>(AboutmeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
