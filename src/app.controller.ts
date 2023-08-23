import { Controller, Get, Render, Param, Request, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  async getMain(@Request() req) {
    const cookie: string = await req.cookies['authorization'];
    if (cookie) {
      // console.log('15번라인');
      return { isLogin: 1 };
    }
    return {
      isLogin: 0,
    };
  }

  // 로그인경로
  @Get('signin/:type') // 경로뒤에 타입을 user company 중 어느것을 입력하는지에 따라 화면이 바뀜
  // @Render('signin')
  async getSignin(
    @Request() req,
    @Param('type') type: string,
    @Res() res: Response, //{ passthrough: true } 가 있으면 중복 반환 에러가 뜬다.
  ) {
    const cookie: string = await req.cookies['authorization'];
    if (cookie) {
      // 리다이렉트를 하면서 데이터를 전달하는 방법을 찾자..
      // this.getMain(req, type);
      // return { type: param, isLogin: 1 }; // 만약 로그인 되어있으면 진입 금지

      res.redirect('/'); // { passthrough: true } 가 없으니 중복가 안뜸
      return;
      // return res.render('index', {
      //   isLogin: 1,
      // });
    }
    return res.render(`signin`, {
      // 'ejs 파일이름'
      type,
    }); // 클라이언트에서 받은 params값을 nest에서 ejs로 보내려면
  }

  // 회원가입 경로
  @Get('signup/:type') // 경로뒤에 타입을 user company 중 어느것을 입력하는지에 따라 화면이 바뀜
  @Render('signup')
  getSignup(
    @Request() req,
    @Param() param: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const cookie: string = req.cookies['authorization'];
    if (cookie) {
      return res.redirect('/'); // 만약 로그인 되어있으면 진입 금지
    }
    return { type: param['type'], isLogin: 0 };
  }

  @Get('chat')
  @Render('chat')
  getChat() {
    return { title: 'Title' };
  }

  // 유저 - 서브 페이지
  @Get('subpage/user')
  @Render('subpage-user')
  getSubpageUser() {
    return { title: 'Title' };
  }

  // 회사 - 서브 페이지
  @Get('subpage/company')
  @Render('subpage-company')
  getSubpageCompany() {
    return { title: 'Title' };
  }

  // 유저 - 마이페이지
  @Get('mypage/user')
  @Render('mypage-user')
  getMypageUser() {
    return { title: 'Title' };
  }

  // 유저 - 마이페이지
  @Get('mypage/company')
  @Render('mypage-company')
  getMypageComapny() {
    return { title: 'Title' };
  }

  // 채용공고 서비스
  @Get('jobposting')
  @Render('jobposting')
  getHiyalu() {
    return { title: 'Title' };
  }
}
