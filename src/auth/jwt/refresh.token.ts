import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RefreshToken {
  constructor(private configService: ConfigService) {}

  // refreshToken저장하기
  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentRefreshToken = await this.getHashRefToken(refreshToken);
    const currentRefreshTokenExp = await this.getRefTokenExp();

    return {
      currentRefreshToken,
      currentRefreshTokenExp,
    };
  }
  // getCurrentHashedRefreshToken(), getCurrentRefreshTokenExp()를 통해 현재 Refresh-Token값과 해당 토큰의 만료시간을 받아온다.

  async getHashRefToken(refreshToken: string) {
    // 토큰 값을 그대로 저장하기 보단, 암호화를 거쳐 데이터베이스에 저장한다.
    // bcrypt는 단방향 해시 함수이므로 암호화된 값으로 원래 문자열을 유추할 수 없다.
    const saltOrRounds = 10;
    const currentRefreshToken = await bcrypt.hash(refreshToken, saltOrRounds);
    return currentRefreshToken;
  }

  async getRefTokenExp(): Promise<Date> {
    const currentDate = new Date();
    // Date 형식으로 데이터베이스에 저장하기 위해 문자열을 숫자 타입으로 변환 (paresInt)
    const currentRefreshTokenExp = new Date(
      currentDate.getTime() +
        parseInt(this.configService.get<string>('JWT_REFRESH_EXPIRATION_TIME')),
    );
    return currentRefreshTokenExp;
  }
}
