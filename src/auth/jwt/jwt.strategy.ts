import { Injectable } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 헤더로부터 토큰 추출하는 함수
      // ignoreExpiration: false,
      secretOrKey: configService.get<string>('ACCESS_TOKEN_KEY'), //process.env.JWT_SECRET_KEY,
    });
  }
}
