import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';
import { CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class LocalGuard implements CanActivate {
  constructor(private authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<any> {
    const req = context.switchToHttp().getRequest();
    if (req.body.email === '' || req.body.pasword === '') {
      throw new UnauthorizedException();
    }
    // 클라이언트에서 온 role을 보고 user로그인인지 company로그인인지 판별
    const user = await this.authService.validateClient(
      req.body.email,
      req.body.password,
      req.body.role,
    );
    console.log('user = ', user);
    if (!user) {
      throw new UnauthorizedException();
    }
    req['user'] = user;
    return user;
  }
}
