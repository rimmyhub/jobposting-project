import { Body, Controller, Post } from '@nestjs/common';
import { ChatgptService } from './chatgpt.service';

@Controller('api/chatgpt')
export class ChatgptController {
  constructor(private readonly chatgptService: ChatgptService) {}

  @Post()
  createChatgpt(@Body('experience') experience: string) {
    return this.chatgptService.createChatgpt(experience);
  }
}
