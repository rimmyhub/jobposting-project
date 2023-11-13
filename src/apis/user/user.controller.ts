import {
  Controller,
  Get,
  Post,
  Body,
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
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '../domain/user.entity';

@Controller('api/users')
@ApiTags('유저 API')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly mailService: MailService,
  ) {}

  // email만 가져오기
  @Get('/get-email/:id')
  @ApiOperation({
    summary: '이메일 가져오는 API',
    description: '유저 이메일',
  })
  @ApiCreatedResponse({ description: '유저 이메일' })
  async getEmail(@Param('id') id: string): Promise<any> {
    console.log('id', id);
    const result = await this.userService.getEmail(id);
    console.log('email만 가져오기 ', result);
    return result;
  }

  // 회원가입
  @UsePipes(ValidationPipe)
  @Post('/signup')
  @ApiOperation({
    summary: '회원가입 API',
    description: '유저 회원가입',
  })
  @ApiCreatedResponse({ description: '유저 회원가입', type: User })
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
  @ApiOperation({
    summary: '(유저가드 적용) 유저정보 상세조회 API',
    description: '(유저가드 적용) 유저정보 상세조회',
  })
  @ApiCreatedResponse({
    description: '(유저가드 적용) 유저정보 상세조회',
    type: User,
  })
  findOneUser(@Request() req) {
    // if (id) {
    //   console.log('findOne = ', id);
    //   return this.userService.findOne(id);
    // }
    // AuthGuard로 받은 req안에 user에 접근하면 현재 로그인한 유저(회사)의 정보에 접근할 수 있습니다.
    return this.userService.getUserById(req.user.id);
  }
  // 유저정보 조회
  @Get('/user/:id')
  @ApiOperation({
    summary: '유저정보 조회 API',
    description: '유저 정보조회',
  })
  @ApiCreatedResponse({ description: '유저 정보조회', type: User })
  findUser(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  // 유저정보 수정
  @UseGuards(UserGuard)
  @Put()
  @ApiOperation({
    summary: '(유저가드 적용)유저정보 수정 API',
    description: '(유저가드 적용)유저 정보 수정',
  })
  @ApiCreatedResponse({
    description: '(유저가드 적용)유저 정보 수정',
    type: User,
  })
  update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(req.user.id, updateUserDto);
  }

  // 유저 이미지 수정
  @UseGuards(UserGuard)
  @Put('/image')
  @ApiOperation({
    summary: '(유저가드 적용)유저 이미지 수정 API',
    description: '(유저가드 적용)유저 이미지 수정',
  })
  @ApiCreatedResponse({
    description: '(유저가드 적용)유저 이미지 수정',
  })
  updateUserImage(@Request() req, @Body('image') image: string) {
    console.log(image);
    return this.userService.updateUserImage(req.user.id, image);
  }

  // 회원탈퇴 (softDelete)
  @UseGuards(UserGuard)
  @Delete()
  @ApiOperation({
    summary: '(유저가드 적용)유저정보 삭제 API',
    description: '(유저가드 적용)유저정보 삭제',
  })
  @ApiCreatedResponse({
    description: '(유저가드 적용)유저정보 삭제',
    type: User,
  })
  remove(@Request() req) {
    return this.userService.removeUser(req.user.id);
  }

  // 인증번호 전송
  @Post('/send-verification')
  @ApiOperation({
    summary: '(이메일 인증)인증번호 전송 API',
    description: '(이메일 인증)인증번호 전송',
  })
  @ApiCreatedResponse({
    description: '(이메일 인증)인증번호 전송',
  })
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
  @ApiOperation({
    summary: '(이메일 인증)인증 API',
    description: '(이메일 인증)인증',
  })
  @ApiCreatedResponse({
    description: '(이메일 인증)인증',
  })
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
