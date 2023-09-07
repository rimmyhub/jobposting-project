import {
  Get,
  Controller,
  Param,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ChatContentService } from './chat-content.service';
import { CreateChatContentDto } from './dto/create-chat-content.dto';
import { UpdateChatContentDto } from './dto/update-chat-content.dto';
import { UserGuard } from 'src/auth/jwt/jwt.user.guard';
import { CompanyGuard } from 'src/auth/jwt/jwt.company.guard';

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

  // 채팅내용 읽음처리
  @UseGuards(UserGuard)
  @Put('/user/:id')
  async userReadChat(@Param('id') chatId: number, @Request() req) {
    try {
      await this.chatContentService.readChatContents(chatId, req.user.id);
    } catch (e) {
      return {
        message: e.message,
      };
    }
  }

  @UseGuards(CompanyGuard)
  @Put('/company/:id')
  async comReadChat(@Param('id') id: number, @Request() req) {
    try {
      console.log('req.company.id = ', req.company.id);
      await this.chatContentService.readChatContents(id, req.company.id);
    } catch (e) {
      return {
        message: e.message,
      };
    }
  }
}
