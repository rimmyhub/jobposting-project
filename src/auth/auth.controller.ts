import {
  Controller,
  Get,
  Post,
  Res,
  Body,
  Patch,
  Param,
  Delete,
  Header,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 유저로그인
  @Post('user')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const role: string = 'user';
    const jwt = await this.authService.login(loginDto, role);
    console.log(jwt.token);
    res.cookie('authorization', `Bearer ${jwt.token}`);
    return '로그인되었습니다'; // 네스트기본적인 응답값은 JSON값으로 반환이 된다.
  }

  // 회사로그인
  @Post('company')
  async companyLogin(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const role: string = 'company';
    const jwt = await this.authService.login(loginDto, role);
    res.cookie('authorization', `Bearer ${jwt.token}`);
    return '로그인되었습니다'; // 네스트기본적인 응답값은 JSON값으로 반환이 된다.
  }

  // 로그아웃
  @Delete('logout')
  async logout(@Request() req, @Res({ passthrough: true }) res: Response) {
    // 먼저 로그아웃이 되어있는지 확인하기
    const authorization = await req.cookies['authorization'];
    console.log('authorization = ', authorization);
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
