import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// 데이터베이스와 레포지토리를 쓰려면
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../domain/user.entity';

@Injectable()
export class UserService {
  // 레포지토리를 쓰려면 constructor에 정의
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // 유저정보상세조회
  async findOne(id: number) {
    const userInfo = await this.userRepository.findOne({
      where: { userId: id },
    });

    if (!userInfo) {
      throw new HttpException(
        '유저를 찾을 수 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
    return userInfo;
  }

  // 유저생성
  async create(createUserDto: CreateUserDto) {
    // 유저의 이메일이 중복되는지 확인
    const isEmail = await this.findEmail(createUserDto.email);
    console.log('isEmail = ', isEmail);

    // 중복 에러처리하기
    if (isEmail) {
      throw new HttpException(
        '이미 가입된 이메일입니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.userRepository.save(createUserDto);
  }

  // 유저의 이메일을 찾아주는 함수
  async findEmail(email: string) {
    const isEmail = await this.userRepository.findOne({
      select: { email: true, password: true },
      where: { email },
    });
    // 이메일이 없을 경우
    if (!isEmail) {
      throw new HttpException(
        '가입되지 않은 이메일입니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return isEmail;
  }

  // 유저정보 수정
  async update(id: number, updateUserDto: UpdateUserDto) {
    // 먼저 유저가 있는지 확인한다.
    await this.findOne(id);
    this.userRepository.update(id, updateUserDto);

    return `수정이 완료되었습니다.`;
  }

  // 유저 탈퇴 deleteAt에 삭제시간 넣기
  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  findAll() {
    return `This action returns all users`;
  }
}
