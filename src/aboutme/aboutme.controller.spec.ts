import { Test, TestingModule } from '@nestjs/testing';
import { AboutmeController } from './aboutme.controller';
import { AboutmeService } from './aboutme.service';

describe('AboutmeController', () => {
  let controller: AboutmeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AboutmeController],
      providers: [AboutmeService],
    }).compile();

    controller = module.get<AboutmeController>(AboutmeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
