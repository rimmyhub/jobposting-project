// import { Strategy } from 'passport-local';
// import { PassportStrategy } from '@nestjs/passport';
// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { AuthService } from '../auth.service';

import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

// // local-auth.guard.ts에서 얘를 상속받아서
// // login함수 앞에   @UseGuards(LocalAuthGuard)를 붙이면
// // LocalAuthGuard를 통해서 여기로 요청 바디의 데이터를 받는다.
// // validateUser을 통해 검증을 받아서 user라는 상수에 담아 보낸다.

// @Injectable()
// export class LocalStrategy extends PassportStrategy(Strategy) {
//   constructor(private authService: AuthService) {
//     super({
//       usernameField: 'email',
//       passwordField: 'password',
//     });
//   }
//   // 클라이언트에서 온 role을 보고 user로그인인지 company로그인인지 판별
//   async validate(email: string, password: string, role: string): Promise<any> {
//     const user = await this.authService.valitateClient(email, password, role);

//     if (!user) {
//       throw new UnauthorizedException();
//     }
//     return user;
//   }
// }

export class LocalGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    console.log('req = ', req.body);
    return true;
  }
}
