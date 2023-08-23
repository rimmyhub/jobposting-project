import {
  Controller,
  Get,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  // MailService의 인스턴스를 주입받는 생성자
  constructor(private readonly mailService: MailService) {}

  //   @Get()
  //   sendMail(): void {
  //     // MailService의 sendMail() 메소드를 호출하여 이메일을 보내는 작업을 수행
  //     return this.mailService.sendMail();
  //   }
  @Post('send')
  async sendMail(@Body('email') email: string): Promise<string> {
    try {
      await this.mailService.sendMail(email);
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
