import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// 데이터베이스와 레포지토리를 쓰려면
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull, And, LessThan } from 'typeorm';
import { User } from '../domain/user.entity';
import { Cron } from '@nestjs/schedule';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  findAllData(arg0: number) {
    throw new Error('Method not implemented.');
  }
  // 레포지토리를 쓰려면 constructor에 정의
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // 이메일 가져오기
  async getEmail(id: string) {
    const result = await this.userRepository.findOne({
      select: ['email'],
      where: { id: id },
    });
    return result;
  }

  // 유저정보상세조회
  async findOne(id: string) {
    const userInfo = await this.userRepository.findOne({
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        gender: true,
        address: true,
        birth: true,
        image: true,
      },
      where: { id: id }, // deleteAt값이 null인값만 찾는다
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
    const {
      email,
      address,
      birth,
      gender,
      name,
      password,
      phone,
      image,
      isVerified,
    } = createUserDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    if (isVerified !== true) {
      throw new HttpException(
        '이메일 인증을 진행해주세요!',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.userRepository.save({
      email,
      password: hashedPassword,
      name,
      address,
      birth,
      gender,
      phone,
      image,
      isVerified,
    });

    return '회원가입이 완료되었습니다.';
  }

  // 유저정보 수정
  async update(id: string, updateUserDto: UpdateUserDto) {
    // 먼저 유저가 있는지 확인한다.
    await this.findOne(id);
    this.userRepository.update(id, updateUserDto);
    return { message: `수정이 완료되었습니다.` };
  }

  // 유저 이미지 수정
  async updateUserImage(id: string, image: string) {
    console.log(image);
    const isUser = await this.userRepository.findOne({ where: { id } });
    if (!isUser) {
      throw new HttpException(
        '유저를 찾을 수 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
    isUser.image = image;
    await this.userRepository.save(isUser);
    return isUser;
  }

  // 유저 탈퇴 deleteAt에 삭제시간 넣기
  async remove(id: string) {
    // 유저가 있는지 확인
    const isUser = await this.userRepository.findOne({
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        gender: true,
        address: true,
        birth: true,
        image: true,
      },
      where: { id, deletedAt: Not(IsNull()) },
    });
    if (!isUser) {
      throw new HttpException(
        '유저를 찾을 수 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // 먼저 소프트delete로 탈퇴를 한 날짜를 DB에 저장 후
    // 추후에 node-scheduler로 delete_at이 null이 아닌 컬럼들을 삭제하지
    // 정해야하는것
    // 완전탈퇴까지 며칠을 둬야하나
    // node-scheduler를 어떻게 짜야하나
    // softDelete라는 메서드를 이용하면 delete_at에 값이 들어감
    await this.userRepository.softDelete(id);
    return `탈퇴 되었습니다.`;
  }

  // 유저의 이메일을 찾아주는 함수
  async findEmail(email: string) {
    const isEmail = await this.userRepository.findOne({
      select: { id: true, email: true, password: true, isVerified: true },
      where: { email },
    });

    return isEmail;
  }

  // getUserRefTokenMatch
  async getUserRefTokenMatch(refreToken: string, id: string): Promise<User> {
    const user: User = await this.userRepository.findOne({
      select: {
        email: true,
        currentRefreshToken: true,
        currentRefreshTokenExp: true,
      },
      where: { id },
    });

    // 유저 테이블 내에 정의된 암호화된 refresh_token값과
    // 요청 시 body에 담아준 refresh_token값 비교
    const isRefTokenMatch = await bcrypt.compare(
      refreToken,
      user.currentRefreshToken,
    );
    if (isRefTokenMatch) {
      return user;
    }
  }

  // 인증번호 저장
  async storeVerificationCode(email: string, code: string): Promise<void> {
    const user = this.userRepository.create({ email, verificationCode: code });
    await this.userRepository.save(user);
  }

  // 인증번호 맞는지 확인
  async verifyCode(email: string, code: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { email, verificationCode: code },
    });
    return !!user; // 유저 정보가 있다면 true, 없다면 false 반환
  }

  // 유저의 인증상태를 변경하는 함수
  async updateUserVerification(
    email: string,
    isVerified: boolean,
  ): Promise<boolean> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });

      if (!user) {
        throw new HttpException(
          '사용자를 찾을 수 없습니다.',
          HttpStatus.NOT_FOUND,
        );
      }

      user.isVerified = isVerified;

      await this.userRepository.save(user);
      return true; // 성공적으로 업데이트되었음을 반환
    } catch (error) {
      throw new HttpException(
        '사용자 업데이트 실패',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 유저를 생성할 때, 기존 사용자의 정보를 update한다.
  async updateUserInfo(updateUserDto: CreateUserDto): Promise<any> {
    const { email, password } = updateUserDto;

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (!existingUser) {
      throw new HttpException(
        '사용자를 찾을 수 없습니다.',
        HttpStatus.NOT_FOUND,
      );
    }

    // 인증된 사용자인 경우에만 정보 업데이트
    if (existingUser.isVerified) {
      existingUser.name = updateUserDto.name;
      existingUser.address = updateUserDto.address;
      existingUser.birth = updateUserDto.birth;
      existingUser.gender = updateUserDto.gender;
      existingUser.phone = updateUserDto.phone;
      existingUser.image = updateUserDto.image;

      if (password) {
        // 새로운 비밀번호가 제공된 경우에만 업데이트
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUser.password = hashedPassword;
      }

      await this.userRepository.save(existingUser);

      return '사용자 정보가 업데이트되었습니다.';
    } else {
      throw new HttpException(
        '이메일 인증을 진행해주세요!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Cron('0 */3 * * * *') // 3분마다 실행
  async cleanupTemporaryData() {
    try {
      const expirationTime = new Date(Date.now() - 5 * 60 * 1000); // 현재 시간으로부터 5분 이전의 시간
      await this.userRepository
        .createQueryBuilder()
        .delete()
        .from(User)
        .where({
          createdAt: LessThan(expirationTime), // 현재 시간으로부터 5분 이전의 데이터만 삭제
          password: '', // 비밀번호가 없는 데이터만 삭제
        })
        .execute();

      console.log('임시 데이터 정리가 완료되었습니다.');
    } catch (error) {
      console.error('임시 데이터 정리 중 오류가 발생했습니다.', error);
    }
  }
}
