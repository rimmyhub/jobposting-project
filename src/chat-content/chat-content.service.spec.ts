import { Test, TestingModule } from '@nestjs/testing';
import { ChatContentService } from './chat-content.service';

describe('ChatContentService', () => {
  let service: ChatContentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatContentService],
    }).compile();

    service = module.get<ChatContentService>(ChatContentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
