import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';

// 토큰값안에 포함된 유저의 이메일로 id값을 담아서 보내주자
@Injectable()
// 유저가드
export class UserGuard
  extends PassportStrategy(Strategy)
  implements CanActivate
{
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 헤더로부터 토큰 추출하는 함수
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('ACCESS_TOKEN_KEY'),
    }); // auth.module의 JwtModule.register의 secret키와 같은 키값을 넣어줘야한다.;
  }
  // 가드를 따로 만들어서?
  // 파라미터를 넘김
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest(); // Request에 접근
    const token = this.extractTokenFromHeader(request); // Request의 token을 가지고 온다

    if (!token) {
      // 토큰이 없으면 에러처리
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get<string>('ACCESS_TOKEN_KEY'),
      });
      if (payload.role !== 'user') {
        throw new HttpException(
          '일반 유저만 사용할 수 있습니다.',
          HttpStatus.BAD_REQUEST,
        );
      }

      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload;
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.cookies.authorization.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}
