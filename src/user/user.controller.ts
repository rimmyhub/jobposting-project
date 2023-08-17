import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { validateOrReject, validate } from 'class-validator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 회원가입
  @UsePipes(ValidationPipe)
  @Post('/signup')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // 유저정보 상세조회
  // 얘는 일단 auth기능을 추가해야함
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  // 유저정보 수정
  // 얘는 일단 auth기능을 추가해야함
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  // 회원탈퇴 (softDelete)
  // 얘는 일단 auth기능을 추가해야함
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }
}
