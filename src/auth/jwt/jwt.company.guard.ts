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

@Injectable()
// 유저가드
// 유저가 아닌 클라이언트가 접근하면 에러처리
export class CompanyGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  // 가드를 따로 만들어서?
  // 파라미터를 넘김
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('ACCESS_TOKEN_KEY'),
      });

      if (payload.role !== 'company') {
        throw new HttpException(
          '회사 유저만 사용할 수 있습니다.',
          HttpStatus.BAD_REQUEST,
        );
      }
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['company'] = payload;
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
