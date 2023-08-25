import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// 데이터베이스와 레포지토리를 쓰려면
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull, And } from 'typeorm';
import { User } from '../domain/user.entity';
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

  // 유저의 모든 정보를 조회하는 로직
  async findAllUserData(userId: number) {
    console.log(userId); // 1
    const userAllInfo = await this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.name',
        'user.email',
        'user.gender',
        'user.phone',
        'user.address',
        'resume.title',
        'resume.content',
        'education.schoolTitle',
        'education.major',
        'education.admissionYear',
        'education.graduationYear',
        'career.companyTitle',
        'career.position',
        'career.job',
        'career.joiningDate',
        'career.resignationDate',
        'portfolio.file',
        'portfolio.address',
        'aboutme.title',
        'aboutme.content',
      ])
      .innerJoin('user.resume', 'resume')
      .innerJoin('resume.education', 'education')
      .innerJoin('resume.career', 'career')
      .innerJoin('resume.portfolio', 'portfolio')
      .innerJoin('resume.aboutme', 'aboutme')
      .where('user.id = :id', { id: userId })
      .getMany();

    return userAllInfo;
  }

  // 유저정보상세조회
  async findOne(id: number) {
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
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, address, birth, gender, name, password, phone, image } =
      createUserDto;

    console.log(image);
    // 유저의 이메일이 중복되는지 확인
    const isEmail = await this.findEmail(email);

    // 중복 에러처리하기
    if (isEmail) {
      throw new HttpException(
        '이미 가입된 이메일입니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.userRepository.save({
      email,
      password: hashedPassword,
      name,
      address,
      birth,
      gender,
      phone,
      image,
    });
    return newUser;
  }


  // 이메일 인증을 완료하는 함수
  async completeVerification(userId: number): Promise<void> {
    // 유저 정보를 DB에서 찾아주자
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    // 유저가 없을시 예외처리
    if (!user) {
      throw new HttpException(
        '유저를 찾을 수 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    
    // 이미 인증을 한 유저인지 확인
    if (!user.isVerified) {
      // 유저의 인증 상태를 변경
      user.isVerified = true;
      user.verificationCode = null;

      await this.userRepository.save(user); // 변경된 상태를 저장
    } else {
      console.log('이미 인증된 상태입니다.');
    }
  }

  // 입력된 인증번호와 DB의 인증번호가 일치하는지 판단하는 함수
  async verifyCode(userId: number, code: string): Promise<boolean> {
    // 유저 정보를 DB에서 찾아주자
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['verificationCode'],
    });

    // 유저가 없을시 예외처리
    if (!user) {
      throw new HttpException(
        '유저를 찾을 수 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // 입력된 인증번호와 DB의 인증번호가 일치하는지 판단
    return user.verificationCode === code;
  }

  // 유저정보 수정
  async update(id: number, updateUserDto: UpdateUserDto) {
    // 먼저 유저가 있는지 확인한다.
    await this.findOne(id);
    this.userRepository.update(id, updateUserDto);
    return { message: `수정이 완료되었습니다.` };
  }

  // 유저 탈퇴 deleteAt에 삭제시간 넣기
  async remove(id: number) {
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
    const user = await this.userRepository.findOne({
      select: ['id', 'email', 'password', 'isVerified'],
      where: { email },
    });

    return user;
  }

  // getUserRefTokenMatch
  async getUserRefTokenMatch(refreToken: string, id: number): Promise<User> {
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

  // 사용자의 인증 번호 설정
  async setVerificationCode(userId: number, code: string): Promise<void> {
    // 사용자의 인증 번호 업데이트
    await this.userRepository.update(userId, { verificationCode: code });
  }
}
