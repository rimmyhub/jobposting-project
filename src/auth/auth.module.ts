import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
// TypeOrmModule과 entity를 가져와서 등록하자
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from '../domain/auth.entity';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt/jwt.strategy';
import { CompanyService } from 'src/company/company.service';
import { CompanyModule } from 'src/company/company.module';

const configService = new ConfigService();

@Module({
  imports: [
    UserModule,
    CompanyModule,
    TypeOrmModule.forFeature([Auth]),
    // jwt설정
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '1h' },
      secret: configService.get<string>('ACCESS_TOKEN_KEY'),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    CompanyService,
    JwtService,
    JwtStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
