import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
// TypeOrmModule과 entity를 가져와서 등록하자
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from '../domain/auth.entity';
import { UserModule } from 'src/user/user.module';
import { UserService } from '../user/user.service';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtModule } from '@nestjs/jwt';
// import { JwtStrategy } from './jwt/jwt.strategy';
import { CompanyService } from '../company/company.service';
import { CompanyModule } from 'src/company/company.module';
import { GenerateToken } from './jwt/generate.token';
import { RefreshToken } from './jwt/refresh.token';
import { Repository } from 'typeorm';
// import { e } from './strategies/local.strategy';
import { LoginDto } from './dto/login.dto';

const configService = new ConfigService();

@Module({
  imports: [
    CompanyModule,
    UserModule,
    CompanyModule,
    TypeOrmModule.forFeature([Auth]),
    // jwt설정
    // PassportModule,
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
    // JwtStrategy,
    GenerateToken,
    RefreshToken,
  ],
  exports: [AuthService],
})
export class AuthModule {}
