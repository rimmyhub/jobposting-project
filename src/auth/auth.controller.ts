import {
  Controller,
  Post,
  Req,
  Res,
  Body,
  Delete,
  Request,
  HttpException,
  HttpStatus,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { LocalGuard } from './login.strategies/auth.strategy';
import { GenerateToken } from './jwt/generate.token';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private generateToken: GenerateToken,
  ) {}
  // 유저로그인
  @UseGuards(LocalGuard)
  @Post('/user')
  async login(
    @Request() req,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const payload = await this.authService.login(
      req.user.id,
      req.user.email,
      req.user.role,
    );

    // access token
    res.cookie('authorization', `Bearer ${payload['accessToken']}`, {
      httpOnly: true,
    });

    // refresh token
    res.cookie('refresh_token', payload['refreshToken'], {
      httpOnly: true,
    });
    return '로그인되었습니다'; // 네스트기본적인 응답값은 JSON값으로 반환이 된다.
  }

  // 회사로그인
  @UseGuards(LocalGuard)
  @Post('/company')
  async companyLogin(
    @Request() req,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const payload = await this.authService.login(
      req.user.id,
      req.user.email,
      req.user.role,
    );
    // access token
    res.cookie('authorization', `Bearer ${payload['accessToken']}`, {
      httpOnly: true,
    });
    // refresh token
    res.cookie('refresh_token', payload['refreshToken'], {
      httpOnly: true,
    });
    return '로그인되었습니다'; // 네스트기본적인 응답값은 JSON값으로 반환이 된다.
  }

  // refresh토큰 재발급하기
  @Post('refresh')
  async refresh(@Req() req, @Res({ passthrough: true }) res: Response) {
    try {
      console.log('refresh', req.cookies.refresh_token);
      const tokens = await this.authService.refresh(req.cookies.refresh_token);

      // this.generateToken.generateAccessToken();
      res.cookie('authorization', `Bearer ${tokens.accessToken}`, {
        httpOnly: true,
      });
      // refresh token
      res.cookie('refresh_token', req.cookies.refresh_token, {
        httpOnly: true,
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh-token');
    }
  }

  // 로그아웃
  @Delete('/logout')
  async logout(@Request() req, @Res({ passthrough: true }) res: Response) {
    console.log(' 로그아웃authorization = ', req.cookies);
    // 먼저 로그아웃이 되어있는지 확인하기
    const authorization = await req.cookies['authorization'];
    if (!authorization) {
      throw new HttpException(
        '현재 로그인 되어있지 않습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
    res.cookie('authorization', '', {
      maxAge: 0,
    });

    return '로그아웃 되었습니다.';
  }
}
