import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { MailService } from '../mail/mail.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserGuard } from '../auth/jwt/jwt.user.guard';

@Controller('api/users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly mailService: MailService,
  ) {}

  // 회원가입
  @UsePipes(ValidationPipe)
  @Post('/signup')
  async create(@Body() createUserDto: CreateUserDto) {
    // 회원가입 로직
    const newUser = await this.userService.create(createUserDto);
    // 인증 코드 생성
    const verificationCode = this.generateVerificationCode();
    // 회원가입 이메일 발송
    await this.mailService.sendMail(newUser.email, verificationCode);
    // 생성된 인증 코드를 유저 정보에 저장
    await this.userService.setVerificationCode(newUser.id, verificationCode);
    return newUser;
  }

  private generateVerificationCode(): string {
    // 인증 코드 생성
    return Math.random().toString(36).substr(2, 6).toUpperCase();
  }

  // 유저정보 상세조회
  @UseGuards(UserGuard)
  @Get('/user-page')
  findOne(@Request() req) {
    // AuthGuard로 받은 req안에 user에 접근하면 현재 로그인한 유저(회사)의 정보에 접근할 수 있습니다.
    return this.userService.findOne(req.user.id);
  }

  // 유저정보 수정
  @UseGuards(UserGuard)
  @Patch()
  update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(req.user.id, updateUserDto);
  }

  // 회원탈퇴 (softDelete)
  // 유저정보 수정
  @UseGuards(UserGuard)
  @Delete()
  remove(@Request() req) {
    return this.userService.remove(req.user.id);
  }
}
