import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

// 얘가 있어야 어디서든 module에 등록해서 갖다 쓸수 있음
@Injectable()
export class GenerateToken {
  constructor(
    private readonly configService: ConfigService,

    private jwtService: JwtService,
  ) {}

  // access-token
  generateAccessToken(id: number, email: string, role: string) {
    const payload = {
      id,
      email,
      role,
    };

    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('ACCESS_TOKEN_KEY'),
      expiresIn: '1h', // 만료시간을 적는다.
    });
  }

  // refresh-token
  // Refresh-Token엔 굳이 유저의 정보가 담겨져 있을 필요가 없다고 판단
  generateRefreshToken(id: number, role: string) {
    const payload = {
      id,
      role,
    };
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('REFRESH_TOKEN_KEY'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION_TIME'),
    });
  }
}
