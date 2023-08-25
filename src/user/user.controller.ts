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
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { MailService } from '../mail/mail.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
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

    return { message: '회원가입되었습니다.' }; // 메세지 응답 추가
  }

  private generateVerificationCode(): string {
    // 인증 코드 생성
    return Math.random().toString(36).substr(2, 6).toUpperCase();
  }

  @Post('/verify')
  async verifyCode(@Body() verifyCodeDto: VerifyCodeDto) {
    const { userId, code } = verifyCodeDto;

    const isVerified = await this.userService.verifyCode(userId, code);

    if (isVerified) {
      // 인증 완료 처리
      await this.userService.completeVerification(userId);
      return { message: '인증이 완료되었습니다.' };
    } else {
      throw new HttpException('유효하지 않은 인증 코드입니다.', 400);
    }
  }

  // 유저정보 상세조회
  @UseGuards(UserGuard)
  @Get('/user-page/:id')
  findOne(@Request() req) {
    // if (id) {
    //   console.log('findOne = ', id);
    //   return this.userService.findOne(id);
    // }
    // AuthGuard로 받은 req안에 user에 접근하면 현재 로그인한 유저(회사)의 정보에 접근할 수 있습니다.
    return this.userService.findOne(req.user.id);
  }
  // 유저정보 조회
  @Get('/user/:id')
  findUser(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  // 유저의 모든 정보 조회
  @Get('/:userId/mypage')
  findAll(@Param('userId') userId: number) {
    return this.userService.findAllUserData(+userId);
  }

  // 유저정보 수정
  @UseGuards(UserGuard)
  @Put()
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
