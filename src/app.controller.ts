import { Controller, Get, Render, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getHello() {
    return { title: 'Title' };
  }

  // 유저회원가입경로
  @Get('signin/:type')
  @Render('signin')
  getSignupUser(@Param() param: string) {
    return { type: param['type'] }; // 클라이언트에서 받은 params값을 nest에서 ejs로 보내려면
  }

  @Get('chat')
  @Render('chat')
  getChat() {
    return { title: 'Title' };
  }
}
