import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDto } from './dto/login.dto';
import { UserService } from 'src/user/user.service';
import { CompanyService } from 'src/company/company.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  // auth.module의 JwtModule로부터 공급 받음
  constructor(
    private readonly configService: ConfigService,
    private userService: UserService,
    private companyService: CompanyService,
    private jwtService: JwtService,
  ) {}

  // 로그인
  async login(loginDto: LoginDto, role: string) {
    const { email, password } = loginDto;

    let result: any;
    if (role === 'user') {
      // 해당 이메일의 유저정보가 있는지 확인
      result = await this.userService.findEmail(email);
    } else if (role === 'company') {
      // 해당 이메일의 회사관리자정보가 있는지 확인
      result = await this.companyService.findEmail(email);
    }

    // 패스워드 확인
    if (!bcrypt.compare(password, result.password)) {
      throw new HttpException(
        '패스워드가 일치하지 않습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // jwt발급받고 내보내기
    const payload = {
      email: result.email,
      id: result.userId,
      role: 'user',
    };

    return {
      // 하... 개빡치네 여기에도 payload 다음 인수로 아래처럼 secret키를 넣어줘야함
      // 공식문서에도 안적혀있네 ㅅ
      token: await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('ACCESS_TOKEN_KEY'),
      }),
    };
  }

  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
