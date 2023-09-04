import { Test, TestingModule } from '@nestjs/testing';
import { ChatContentController } from './chat-content.controller';
import { ChatContentService } from './chat-content.service';

describe('ChatContentController', () => {
  let controller: ChatContentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatContentController],
      providers: [ChatContentService],
    }).compile();

    controller = module.get<ChatContentController>(ChatContentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
