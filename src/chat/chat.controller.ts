import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Chat } from 'src/domain/chat.entity';
import { UserGuard } from 'src/auth/user.guard';

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // 회사가 유저에게 채팅 신청
  @UseGuards(UserGuard)
  @Post(':companyId')
  createUserChat(
    @Request() req,
    @Param('companyId') companyId: string,
    @Body() createChatDto: CreateChatDto,
  ): Promise<Chat> {
    return this.chatService.createUserChat(
      req.user.id,
      +companyId,
      createChatDto,
    );
  }

  // 유저가 회사에게 채팅 신청
}
