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

// 토큰값안에 포함된 유저의 이메일로 id값을 담아서 보내주자
@Injectable()
// 유저가드
export class UserGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
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
      let tokenErr = false;
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('ACCESS_TOKEN_KEY'),
      });

      if (payload.role !== 'user') {
        throw new HttpException(
          '일반 유저만 사용할 수 있습니다.',
          HttpStatus.BAD_REQUEST,
        );
      }
      console.log('UserGuard = ', payload);

      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload;
      console.log('request[user] = ', request['user']);
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.cookies.authorization.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
