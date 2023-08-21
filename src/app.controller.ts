import { Controller, Get, Render } from '@nestjs/common';
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
  @Get('signin-user')
  @Render('signinUser')
  getSignupUser() {
    return { title: 'signinUser' };
  }

  @Get('chat')
  @Render('chat')
  getChat() {
    return { title: 'Title' };
  }

  @Get('main')
  @Render('main')
  getMain() {
    return { title: 'Title' };
  }
}
