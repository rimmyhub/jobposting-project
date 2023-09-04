import { Controller } from '@nestjs/common';
import { ChatContentService } from './chat-content.service';
import { CreateChatContentDto } from './dto/create-chat-content.dto';
import { UpdateChatContentDto } from './dto/update-chat-content.dto';

@Controller('chat-content')
export class ChatContentController {
  constructor(private readonly chatContentService: ChatContentService) {}
}
