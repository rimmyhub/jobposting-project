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
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // refresh토큰 재발급하기
  @Post('refresh')
  async refresh(@Req() req, @Res({ passthrough: true }) res: Response) {
    try {
      const tokens = await this.authService.refresh(req.cookies.refresh_token);
      console.log('tokens = ', tokens);
      res.cookie('authorization', `Bearer ${tokens.accessToken}`, {
        httpOnly: true,
      });
      // refresh token
      res.cookie('refresh_token', tokens.crrRefreshToken, {
        httpOnly: true,
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh-token');
    }
  }

  // 유저로그인
  @Post('user')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const role: string = 'user';
    const payload = await this.authService.login(loginDto, role);

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
  @Post('company')
  async companyLogin(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const role: string = 'company';
    const payload = await this.authService.login(loginDto, role);
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

  // 로그아웃
  @Delete('logout')
  async logout(@Request() req, @Res({ passthrough: true }) res: Response) {
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
