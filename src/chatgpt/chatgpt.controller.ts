import { Controller, Post } from '@nestjs/common';
import { ChatgptService } from './chatgpt.service';

@Controller('api/chatgpt')
export class ChatgptController {
  constructor(private readonly chatgptService: ChatgptService) {}

  @Post()
  createChatgpt() {
    return this.chatgptService.createChatgpt();
  }
}
