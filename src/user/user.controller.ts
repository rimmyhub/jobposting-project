import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
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
    if (createUserDto.isVerified !== true) {
      throw new HttpException(
        '이메일 인증을 진행해주세요!',
        HttpStatus.BAD_REQUEST,
      );
    }

    // 해당 userId를 가진 사용자를 찾아 정보를 업데이트합니다.
    const updatedUser = await this.userService.updateUserInfo(createUserDto);

    return updatedUser;
  }

  // 유저정보 상세조회
  @UseGuards(UserGuard)
  @Get('/user-page')
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

  // 인증번호 전송
  @Post('/send-verification')
  async sendVerification(@Body('email') email: string) {
    console.log('email = ', email);
    const existingUser = await this.userService.findEmail(email);

    if (existingUser) {
      if (existingUser.isVerified) {
        // 이미 가입되고 인증된 이메일인 경우 응답으로 처리
        throw new HttpException(
          '이미 가입된 이메일입니다.',
          HttpStatus.BAD_REQUEST,
        );
      }
      // DB에 저장된 이메일이지만 아직 인증되지 않은 경우 이메일 전송 처리로 진행
    }

    try {
      const verificationCode = this.generateVerificationCode(); // 인증번호 생성

      // 이메일 발송 로직
      await this.mailService.sendMail(email, verificationCode);

      // 인증번호 저장
      await this.userService.storeVerificationCode(email, verificationCode);

      return { message: '이메일로 인증번호가 전송되었습니다.' };
    } catch (error) {
      throw new HttpException(
        '인증번호 전송에 실패했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private generateVerificationCode(): string {
    // 인증번호 생성
    return Math.random().toString(36).substr(2, 6).toUpperCase();
  }

  @Post('/verify')
  async verifyCode(@Body() verifyCodeDto: VerifyCodeDto) {
    const { email, code } = verifyCodeDto;
    const isValid = await this.userService.verifyCode(email, code);

    if (isValid) {
      const updatedUser = await this.userService.updateUserVerification(
        email,
        true,
      );
      if (updatedUser) {
        return { message: '인증이 완료되었습니다.' };
      } else {
        throw new HttpException(
          '사용자 업데이트 실패',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } else {
      throw new HttpException(
        '올바른 인증번호를 입력해주세요.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
