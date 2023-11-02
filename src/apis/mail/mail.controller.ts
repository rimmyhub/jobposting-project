import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { MailService } from './mail.service';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('mail')
@ApiTags('이메일 API')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send')
  @ApiOperation({ summary: '이메일전송 API', description: '이메일전송' })
  @ApiCreatedResponse({ description: '이메일전송' })
  async sendMail(
    @Body('email') email: string,
    @Body('code') code: string,
  ): Promise<string> {
    try {
      await this.mailService.sendMail(email, code); // 인증 코드 추가
      return '인증 이메일을 보냈습니다. 확인해주세요.';
    } catch (error) {
      console.error(error);
      throw new HttpException(
        '인증 이메일 전송에 실패했습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
