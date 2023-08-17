import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';

// TypeOrmModule과 entity를 가져와서 등록하자
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/domain/user.entity';
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
