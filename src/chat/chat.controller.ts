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
import { Chat } from 'src/domain/chat.entity';
import { UserGuard } from 'src/auth/user.guard';
import { CompanyGuard } from 'src/auth/company.guard';

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // 유저가 -> 회사에게 채팅 신청
  @UseGuards(UserGuard)
  @Post(':companyId/company')
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

  // 회사가 -> 유저에게 채팅 신청
  @UseGuards(CompanyGuard)
  @Post(':userId/user')
  createCompanyChat(
    @Request() req,
    @Param('userId') userId: string,
    @Body() createChatDto: CreateChatDto,
  ): Promise<Chat> {
    return this.chatService.createCompanyChat(
      req.company.id,
      +userId,
      createChatDto,
    );
  }

  // 유저가 - 회사 채팅 삭제
  @UseGuards(UserGuard)
  @Delete(':chatId/company')
  removeUserChat(@Request() req, @Param('chatId') chatId: string) {
    return this.chatService.removeUserChat(req.user.id, +chatId);
  }

  // 회사가 - 유저 채팅 삭제
  @UseGuards(CompanyGuard)
  @Delete(':chatId/user')
  removeCompanyChat(@Request() req, @Param('chatId') chatId: string) {
    return this.chatService.removeCompanyChat(req.company.id, +chatId);
  }
}
