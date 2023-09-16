import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { Chat } from 'src/domain/chat.entity';
import { UserGuard } from '../auth/jwt/jwt.user.guard';
import { CompanyGuard } from '../auth/jwt/jwt.company.guard';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('api/chats')
@ApiTags('채팅 API')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // 유저가 -> 회사에게 채팅 신청
  @UseGuards(UserGuard)
  @Post('/user/:companyId')
  @ApiOperation({
    summary: '(유저가드 적용)유저가 회사에게 채팅신청 API',
    description: '유저가 회사에게 채팅신청',
  })
  @ApiCreatedResponse({ description: '유저가 회사에게 채팅신청' })
  createUserChat(
    @Request() req,
    @Param('companyId') companyId: string,
  ): Promise<Chat> {
    return this.chatService.createUserChat(req.user.id, companyId);
  }

  // 회사 -> 유저 채팅 신청
  @UseGuards(CompanyGuard)
  @Post('/company/:userId')
  @ApiOperation({
    summary: '(컴퍼니가드 적용)회사가 유저에게 채팅신청 API',
    description: '회사가 유저에게 채팅신청',
  })
  @ApiCreatedResponse({ description: '회사가 유저에게 채팅신청' })
  async createCompanyChat(
    @Request() req,
    @Param('userId') userId: string,
  ): Promise<Chat> {
    const result = await this.chatService.createCompanyChat(
      req.company.id,
      userId,
    );
    return result;
  }

  // 회사관리자의 채팅방 전체조회
  @UseGuards(CompanyGuard)
  @Get('/company')
  @ApiOperation({
    summary: '(컴퍼니가드 적용)회사관리자의 채팅방 전체조회 API',
    description: '회사관리자의 채팅방 전체조회',
  })
  @ApiCreatedResponse({ description: '회사관리자의 채팅방 전체조회' })
  async comGetChatRoom(@Request() req): Promise<Chat[]> {
    const chatRooms = await this.chatService.comGetAllChatRoom(req.company.id);
    return chatRooms;
  }

  // 유저의 채팅방 전체조회
  @UseGuards(UserGuard)
  @Get('/user')
  @ApiOperation({
    summary: '(유저가드 적용)유저의 채팅방 전체조회 API',
    description: '유저의 채팅방 전체조회',
  })
  @ApiCreatedResponse({ description: '유저의 채팅방 전체조회' })
  async userGetChatRoom(@Request() req): Promise<Chat[]> {
    const chatRooms = await this.chatService.userGetAllChatRoom(req.user.id);
    return chatRooms;
  }

  // 유저가 - 회사 채팅 삭제
  @UseGuards(UserGuard)
  @Delete(':chatId/company')
  @ApiOperation({
    summary: '(유저가드 적용)유저 채팅 삭제 API',
    description: '유저 채팅 삭제',
  })
  @ApiCreatedResponse({ description: '유저 채팅 삭제' })
  removeUserChat(@Request() req, @Param('chatId') chatId: string) {
    return this.chatService.removeUserChat(req.user.id, +chatId);
  }

  // 회사가 - 유저 채팅 삭제
  @UseGuards(CompanyGuard)
  @Delete(':chatId/user')
  @ApiOperation({
    summary: '(컴퍼니가드 적용)회사 채팅 삭제 API',
    description: '회사 채팅 삭제',
  })
  @ApiCreatedResponse({ description: '회사 채팅 삭제' })
  removeCompanyChat(@Request() req, @Param('chatId') chatId: string) {
    return this.chatService.removeCompanyChat(req.company.id, +chatId);
  }

  // 채팅내용 저장하기
  @Post('save')
  @ApiOperation({
    summary: '채팅내용 저장 API',
    description: '채팅내용 저장',
  })
  @ApiCreatedResponse({ description: '채팅내용 저장' })
  saveChatContent(@Request() req) {
    const { chatContent, chatId, senderId, senderType } = req.Body;
  }

  // 유저 - 새로운 메세지 체크
  @UseGuards(UserGuard)
  @Get('/check-message/user/:type')
  @ApiOperation({
    summary: '(유저가드 적용)유저-새로운 메세지 조회 API',
    description: '유저-새로운 메세지 조회',
  })
  @ApiCreatedResponse({ description: '유저-새로운 메세지 조회' })
  async userCheckMessage(@Request() req, @Param('type') type: string) {
    const userId = req.user.id;
    const result = await this.chatService.checkChat(userId, type);
    return result;
  }

  // 회사 - 새로운 메세지 체크
  @UseGuards(CompanyGuard)
  @Get('/check-message/company/:type')
  @ApiOperation({
    summary: '(컴퍼니가드 적용)회사-새로운 메세지 조회 API',
    description: '회사-새로운 메세지 조회',
  })
  @ApiCreatedResponse({ description: '회사-새로운 메세지 조회' })
  async companyCheckMessage(@Request() req, @Param('type') type: string) {
    const companyId = req.company.id;
    const result = await this.chatService.checkChat(companyId, type);
    return result;
  }
}
