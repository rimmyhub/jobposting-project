import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
// TypeOrmModule과 entity를 가져와서 등록하자
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from '../user/user.service';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtModule } from '@nestjs/jwt';
import { CompanyService } from '../company/company.service';

import { GenerateToken } from './jwt/generate.token';
import { RefreshToken } from './jwt/refresh.token';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { CompanyModule } from '../company/company.module';
import { UserModule } from '../user/user.module';

const configService = new ConfigService();

@Module({
  imports: [
    CompanyModule,
    UserModule,
    TypeOrmModule.forFeature([]),
    // jwt설정
    PassportModule.register({ defaultStrategy: 'jwt', session: true }),
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '500' }, // access토큰의 수명
      secret: configService.get<string>('ACCESS_TOKEN_KEY'),
    }),
  ],
  controllers: [AuthController],
  providers: [
    LoginDto,
    Repository,
    AuthService,
    UserService,
    CompanyService,
    JwtService,
    GenerateToken,
    RefreshToken,
  ],
  exports: [AuthService],
})
export class AuthModule {}
