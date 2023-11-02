import { Body, Controller, Post } from '@nestjs/common';
import { ChatgptService } from './chatgpt.service';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('api/chatgpt')
@ApiTags('chatGPT API')
export class ChatgptController {
  constructor(private readonly chatgptService: ChatgptService) {}

  @Post()
  @ApiOperation({
    summary: 'chatGPT를 사용한 자기소개서 작성 API',
    description: 'chatGPT를 사용한 자기소개서 작성',
  })
  @ApiCreatedResponse({ description: 'chatGPT를 사용한 자기소개서 작성' })
  createChatgpt(@Body('experience') experience: string) {
    return this.chatgptService.createChatgpt(experience);
  }
}
