import { Injectable } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt, VerifyCallback } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

const configService = new ConfigService();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 헤더로부터 토큰 추출하는 함수
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('ACCESS_TOKEN_KEY'), // auth.module의 JwtModule.register의 secret키와 같은 키값을 넣어줘야한다.
    });
  }

  // 키가 맞다면
  async validate(payload: any, done: VerifyCallback): Promise<any> {
    const user = await this.authService.tokenValidateUser(payload);
  }
}
