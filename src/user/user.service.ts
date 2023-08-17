import { Injectable, ExceptionFilter } from '@nestjs/common';
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

  // 유저생성
  async create(createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    // 유저의 이메일이 중복되는지 확인
    const isEmail = await this.userRepository.findOne({ where: { email } });

    console.log('createUserDto = ', createUserDto);
    await this.userRepository.save(createUserDto);
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
