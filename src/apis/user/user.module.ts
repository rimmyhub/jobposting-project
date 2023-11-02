import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MailModule } from '../mail/mail.module';

// TypeOrmModule과 entity를 가져와서 등록하자
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../domain/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User]), MailModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, TypeOrmModule], // 다른 모듈에서 사용하려면 해당 모듈에서 export해야한다.
})
export class UserModule {}
