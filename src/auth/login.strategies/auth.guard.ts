import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable() // extends AuthGuard('local)은 local.strategy.ts를 상속받은 것
export class LocalAuthGuard extends AuthGuard('local') {}
