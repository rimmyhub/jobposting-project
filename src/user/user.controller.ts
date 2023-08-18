import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserGuard } from '../auth/user.guard';

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
  @UseGuards(UserGuard)
  @Get('/user-page')
  findOne(@Request() req) {
    // AuthGuard로 받은 req안에 user에 접근하면 현재 로그인한 유저(회사)의 정보에 접근할 수 있습니다.
    return this.userService.findOne(req.user.id);
  }

  // 유저정보 수정
  // 얘는 일단 auth기능을 추가해야함
  @UseGuards(UserGuard)
  @Patch()
  update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(req.user.id, updateUserDto);
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
