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

  // 로그인경로
  @Get('signin/:type') // 경로뒤에 타입을 user company 중 어느것을 입력하는지에 따라 화면이 바뀜
  @Render('signin')
  getSignin(@Param() param: string) {
    return { type: param['type'] }; // 클라이언트에서 받은 params값을 nest에서 ejs로 보내려면
  }

  // 회원가입 경로
  @Get('signup/:type') // 경로뒤에 타입을 user company 중 어느것을 입력하는지에 따라 화면이 바뀜
  @Render('signup')
  getSignup(@Param() param: string) {
    return { type: param['type'] };
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
