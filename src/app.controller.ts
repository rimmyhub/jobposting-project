import { Controller, Get, Render, Param, Request, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { get } from 'http';

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

  // 회사 정보
  // uuid값을 가져올 순 없을까?
  @Get('company/:uuid')
  @Render('subpage-company')
  async getSubpageCompany(@Request() req, @Param('uuid') uuid: number) {
    const cookie: string = await req.cookies['authorization'];
    if (cookie) {
      return { isLogin: 1, uuid };
    }
    return {
      isLogin: 0,
      uuid,
    };
  }

  // 채용공고 (로그인 없이 모든 공고 조회)
  @Get('jobposting/:jobpostingId')
  @Render('jobposting-user')
  async getJobpstingUser(
    @Request() req,
    @Param('jobpostingId') jobpostingId: string,
  ) {
    // 그냥 authorization가 들어가 있으면 통과해버림
    // 다른 방법 생각해보자
    const cookie: string = await req.cookies['authorization'];
    if (cookie) {
      return { isLogin: 1, jobpostingId };
    }
    return {
      isLogin: 0,
      jobpostingId,
    };
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
      return { isLogin: 1 };
    }
    return {
      isLogin: 0,
    };
  }

  // 유저 - 마이페이지
  @Get('mypage')
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

  // 회사 로그인 시 - 채용 공고
  @Get('jobposting/company')
  // @Render('jobposting-company')
  getJobpstingCompany(
    @Request() req,
    @Res() res: Response,
    @Param('type') type: string,
  ) {
    const cookie: string = req.cookies['authorization'];
    if (!cookie) {
      return res.redirect('/signin/company'); // 만약 로그인 되어있으면 진입 금지
    }
    return res.render('jobposting-company', {
      type,
      isLogin: 1,
    });
  }

  // 채용공고 지원 내역 보기
  @Get('apply/:type')
  async getApply(
    @Request() req,
    @Param('type') type: string,
    @Res() res: Response,
  ) {
    const cookie: string = await req.cookies['authorization'];
    if (!cookie) {
      return res.redirect('/singin'); // 쿠키가 없으면 로그인하게 이동
    }
    return res.render('apply', {
      type,
      isLogin: 1,
    });
  }
}
//   // 채용공고 지원 내역 보기
//   @Get('/apply')
//   @Render('apply')
//   async getApply(@Request() req) {
//     const cookie: string = await req.cookies['authorization'];
//     if (cookie) {
//       return { isLogin: 1 };
//     }
//     return {
//       isLogin: 0,
//     };
//   }
// }
