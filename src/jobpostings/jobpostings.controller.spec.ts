import { Test, TestingModule } from '@nestjs/testing';
import { JobpostingsController } from './jobpostings.controller';
import { JobpostingsService } from './jobpostings.service';

describe('JobpostingsController', () => {
  let controller: JobpostingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobpostingsController],
      providers: [JobpostingsService],
    }).compile();

    controller = module.get<JobpostingsController>(JobpostingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
