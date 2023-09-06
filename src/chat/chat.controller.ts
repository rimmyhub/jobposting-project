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
import { Chat } from 'src/domain/chat.entity';
import { UserGuard } from '../auth/jwt/jwt.user.guard';
import { CompanyGuard } from '../auth/jwt/jwt.company.guard';

@Controller('api/chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // 유저가 -> 회사에게 채팅 신청
  @UseGuards(UserGuard)
  @Post('/user/:companyId')
  createUserChat(
    @Request() req,
    @Param('companyId') companyId: string,
  ): Promise<Chat> {
    return this.chatService.createUserChat(req.user.id, +companyId);
  }

  // 회사 -> 유저 채팅 신청
  @UseGuards(CompanyGuard)
  @Post('/company/:userId')
  async createCompanyChat(
    @Request() req,
    @Param('userId') userId: string,
  ): Promise<Chat> {
    const result = await this.chatService.createCompanyChat(
      req.company.id,
      Number(userId),
    );
    return result;
  }

  // 회사관리자의 채팅방 전체조회
  @UseGuards(CompanyGuard)
  @Get('/company')
  async comGetChatRoom(@Request() req): Promise<Chat[]> {
    console.log('getChatRoom = ', req.company.id);
    const chatRooms = await this.chatService.comGetAllChatRoom(req.company.id);
    return chatRooms;
  }

  // 유저의 채팅방 전체조회
  @UseGuards(UserGuard)
  @Get('/user')
  async userGetChatRoom(@Request() req): Promise<Chat[]> {
    console.log('getChatRoom = ', req.user.id);
    const chatRooms = await this.chatService.userGetAllChatRoom(req.user.id);
    return chatRooms;
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

  // 채팅내용 저장하기
  @Post('save')
  saveChatContent(@Request() req) {
    const { chatContent, chatId, senderId, senderType } = req.Body;
    console.log('save = ', chatContent, chatId, senderId, senderType);
  }
}
