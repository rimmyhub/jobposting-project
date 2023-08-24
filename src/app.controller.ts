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
      // return { type: param, isLogin: 1 }; // 만약 로그인 되어있으면 진입 금지
      res.redirect('/'); // { passthrough: true } 가 없으니 중복가 안뜸
      return;
    }
    return res.render(`signin`, {
      // 'ejs 파일이름'
      type,
    });
  }

  // 회원가입 경로
  @Get('signup/:type') // 경로뒤에 타입을 user company 중 어느것을 입력하는지에 따라 화면이 바뀜
  // @Render('signup')
  getSignup(@Request() req, @Param('type') type: string, @Res() res: Response) {
    const cookie: string = req.cookies['authorization'];
    if (cookie) {
      return res.redirect('/'); // 만약 로그인 되어있으면 진입 금지
    }
    return res.render('signup', {
      type,
    });
  }

  @Get('chat')
  @Render('chat')
  getChat() {
    return { title: 'Title' };
  }

  // 유저 - 서브 페이지
  @Get('subpage/:userId/:resumeId')
  @Render('subpage-user')
  async getSubpageUser(
    @Request() req,
    @Param('userId') userId: string,
    @Param('resumeId') resumeId: string,
  ) {
    const cookie: string = await req.cookies['authorization'];
    if (cookie) {
      // console.log('15번라인');
      return { isLogin: 1 };
    }
    return {
      isLogin: 0,
    };
    // return { title: 'Title' };
  }

  // 회사 - 서브 페이지
  @Get('subpage/company')
  @Render('subpage-company')
  getSubpageCompany() {
    return { title: 'Title' };
  }

  // 유저 - 마이페이지
  @Get('mypage')
  // @Render('mypage-user')
  getMypageUser(
    @Request() req,
    @Res() res: Response,
    @Param('type') type: string,
  ) {
    const cookie: string = req.cookies['authorization'];
    if (!cookie) {
      return res.redirect('/signin/user'); // 만약 로그인 되어있으면 진입 금지
    }
    return res.render('mypage-user', {
      type,
      isLogin: 1,
    });
  }

  // 회사 - 마이페이지
  @Get('mypage/company')
  // @Render('mypage-company')
  getMypageComapny(
    @Request() req,
    @Res() res: Response,
    @Param('type') type: string,
  ) {
    const cookie: string = req.cookies['authorization'];
    if (!cookie) {
      return res.redirect('/signin/company'); // 만약 로그인 되어있으면 진입 금지
    }
    return res.render('mypage-company', {
      type,
      isLogin: 1,
    });
  }

  // 채용공고 서비스
  @Get('jobposting')
  @Render('jobposting')
  getHiyalu() {
    return { title: 'Title' };
  }
}
