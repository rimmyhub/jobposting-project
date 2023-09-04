import { Get, Controller, Param } from '@nestjs/common';
import { ChatContentService } from './chat-content.service';
import { CreateChatContentDto } from './dto/create-chat-content.dto';
import { UpdateChatContentDto } from './dto/update-chat-content.dto';

@Controller('api/chat-content')
export class ChatContentController {
  constructor(private readonly chatContentService: ChatContentService) {}

  // 채팅 내용 가져오기
  @Get('/:id')
  async getChatContent(@Param('id') chatId: number): Promise<any> {
    try {
      const result = await this.chatContentService.getChatContents(chatId);
      return result;
    } catch (e) {
      console.log(e);
      return {
        message: e.message,
      };
    }
  }
}
