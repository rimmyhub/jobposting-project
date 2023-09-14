import { Controller, Get, Render, Param, Request, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { get } from 'http';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('메인 API')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'index render API', description: 'index render' })
  @ApiCreatedResponse({ description: 'index render' })
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
  @ApiOperation({ summary: 'signIn render API', description: 'signIn render' })
  @ApiCreatedResponse({ description: 'signIn render' })
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
  @ApiOperation({ summary: 'signup render API', description: 'signup render' })
  @ApiCreatedResponse({ description: 'signup render' })
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
  @Get('company/:id')
  @ApiOperation({
    summary: 'subPage-company render API',
    description: 'subPage-company render',
  })
  @ApiCreatedResponse({ description: 'subPage-company render' })
  @Render('subpage-company')
  async getSubpageCompany(@Request() req, @Param('id') id: string) {
    const cookie: string = await req.cookies['authorization'];
    // console.log('id = ', id);
    if (cookie) {
      return { isLogin: 1, id };
    }

    return {
      isLogin: 0,
      id,
    };
  }

  // 채용공고 추가
  @Get('jobposting/add')
  @ApiOperation({
    summary: 'jobposting-add render API',
    description: 'jobposting-add render',
  })
  @ApiCreatedResponse({ description: 'jobposting-add render' })
  @Render('jobposting-add')
  async getJobpstingAdd(@Request() req) {
    const cookie: string = await req.cookies['authorization'];
    if (cookie) {
      return { isLogin: 1 };
    }
    return {
      isLogin: 0,
    };
  }

  // 채용공고 (로그인 없이 모든 공고 조회)
  @Get('jobposting/:jobpostingId')
  @ApiOperation({
    summary: 'jobposting render API',
    description: 'jobposting render',
  })
  @ApiCreatedResponse({ description: 'jobposting render' })
  @Render('jobposting')
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

  // 채용공고 수정
  @Get('jobposting/edit/:jobpostingId')
  @ApiOperation({
    summary: 'jobposting-edit render API',
    description: 'jobposting-edit render',
  })
  @ApiCreatedResponse({ description: 'jobposting-edit render' })
  @Render('jobposting-edit')
  async getJobpstingEdit(
    @Request() req,
    @Param('jobpostingId') jobpostingId: string,
  ) {
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
  @ApiOperation({
    summary: 'subPage-user render API',
    description: 'subPage-user render',
  })
  @ApiCreatedResponse({ description: 'subPage-user render' })
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
  @ApiOperation({
    summary: 'myPage-user render API',
    description: 'myPage-user render',
  })
  @ApiCreatedResponse({ description: 'myPage-user render' })
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
  @ApiOperation({
    summary: 'myPage-company render API',
    description: 'myPage-company render',
  })
  @ApiCreatedResponse({ description: 'myPage-company render' })
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

  // 회사 - 지원자 확인
  @Get('applyuser/:jobpostingId')
  @ApiOperation({
    summary: 'apply-user render API',
    description: 'apply-user render',
  })
  @ApiCreatedResponse({ description: 'apply-user render' })
  getApplyUser(
    @Request() req,
    @Res() res: Response,
    @Param('jobpostingId') jobpostingId: string,
  ) {
    const cookie: string = req.cookies['authorization'];
    if (!cookie) {
      return res.redirect('/signin/company'); // 만약 로그인 되어있으면 진입 금지
    }
    return res.render('apply-user', {
      isLogin: 1,
    });
  }

  // 회사 로그인 시 - 채용 공고
  @Get('jobposting/company')
  @ApiOperation({
    summary: 'jobposting-company render API',
    description: 'jobposting-company render',
  })
  @ApiCreatedResponse({ description: 'jobposting-company render' })
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
  @ApiOperation({ summary: 'apply render API', description: 'apply render' })
  @ApiCreatedResponse({ description: 'apply render' })
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
