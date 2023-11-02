import {
  Injectable,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CompanyService } from '../company/company.service';
import { GenerateToken } from './jwt/generate.token';
import { RefreshToken } from './jwt/refresh.token';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../domain/user.entity';
import { Company } from '../domain/company.entity';

import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  // auth.module의 JwtModule로부터 공급 받음
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private refreshToken: RefreshToken,
    private generateToken: GenerateToken,
    private userService: UserService,
    private companyService: CompanyService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async tokenValidateUser(payload: any): Promise<any> | undefined {}

  async refresh(refresh: string) {
    const refreshToken = refresh;
    let result: object;

    // Verify refresh token
    // JWT Refresh Token 검증 로직
    const decodeRefToken = this.jwtService.verify(refreshToken, {
      secret: this.configService.get<string>('REFRESH_TOKEN_KEY'),
    });
    const userId = decodeRefToken.id;
    if (decodeRefToken.role === 'user') {
      result = await this.userService.getUserRefTokenMatch(
        refreshToken,
        userId,
      );
    } else if (decodeRefToken.role === 'company') {
      const companyId = decodeRefToken.id;
      result = await this.companyService.getCompanyRefTokenMatch(
        refreshToken,
        companyId,
      );
    }

    if (!result) {
      throw new UnauthorizedException('Invalid user!');
    }

    // Generate new access token
    const accessToken = await this.generateToken.generateAccessToken(
      decodeRefToken.id,
      result['email'],
      decodeRefToken.role,
    );
    const crrRefreshToken = result['currentRefreshToken'];
    return {
      accessToken,
      crrRefreshToken,
    };
  }

  // validate
  async validateClient(email: string, password: string, role: string) {
    let clientInfo: any;
    // 유저인지 회사인지 판단한다.
    if (role === 'user') {
      // 해당 이메일의 유저정보가 있는지 확인
      clientInfo = await this.userService.findEmail(email);
    } else if (role === 'company') {
      // 해당 이메일의 회사관리자정보가 있는지 확인
      clientInfo = await this.companyService.findEmail(email);
    }

    // 로그인한 회사의 id email password를 result에 담는다.
    // 패스워드일치 확인

    await this.validatePassword(password, clientInfo.password);

    const payload = {
      id: clientInfo.id ? clientInfo.id : clientInfo.uuid,
      email: clientInfo.email,
      role: role,
    };
    // 클라이언트의 정보를 보낸다
    return payload;
  }

  // 로그인
  async login(id: number, email: string, role: string) {
    let payload: object;
    // accessToken 생성
    const accessToken = await this.generateToken.generateAccessToken(
      id,
      email,
      role,
    );

    // refreshToken생성
    const refreshToken = await this.generateToken.generateRefreshToken(
      id,
      role,
    );

    this.setRefreshToken(refreshToken, role, id);

    // 뭉탱이로 보내자
    payload = {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };

    // accessToken과 refreshToken을 담은 payload를 반환
    return payload;
  }

  // 패스워드 일치여부 확인 함수
  async validatePassword(confirmPassword: string, password: string) {
    if (!(await bcrypt.compare(confirmPassword, password))) {
      throw new HttpException(
        '패스워드가 일치하지 않습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // refreshToken 저장
  async setRefreshToken(refreshToken: string, role: string, id: number) {
    const payload = await this.refreshToken.setCurrentRefreshToken(
      refreshToken,
      id,
    );
    if (role === 'user') {
      await this.userRepository.update(id, {
        currentRefreshToken: payload['currentRefreshToken'],
        currentRefreshTokenExp: payload['currentRefreshTokenExp'],
      });
    } else if (role === 'company') {
      await this.companyRepository.update(id, {
        currentRefreshToken: payload['currentRefreshToken'],
        currentRefreshTokenExp: payload['currentRefreshTokenExp'],
      });
    }
  }
}
