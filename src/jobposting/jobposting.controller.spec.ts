import { Test, TestingModule } from '@nestjs/testing';
import { JobpostingController } from './jobposting.controller';
import { JobpostingService } from './jobposting.service';

describe('JobpostingController', () => {
  let controller: JobpostingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobpostingController],
      providers: [JobpostingService],
    }).compile();

    controller = module.get<JobpostingController>(JobpostingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
