import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { CreateApplicantDto } from './dto/create-applicant.dto';
import { Applicant } from 'src/domain/applicant.entity';
import { User } from 'src/domain/user.entity';
import { Jobposting } from 'src/domain/jobposting.entity';
import { HttpException, HttpStatus } from '@nestjs/common';

export class ApplicantService {
  constructor(
    @InjectRepository(Applicant)
    private readonly applicantRepository: Repository<Applicant>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Jobposting)
    private readonly jobpostingRepository: Repository<Jobposting>,
  ) {}

  // 지원하기
  async createApply(id: number, jobpostingId: number): Promise<Applicant> {
    // 사용자 조회
    const existingUser = await this.userRepository.findOne({ where: { id } });

    if (!existingUser) {
      throw new HttpException('회원가입이 필요합니다.', HttpStatus.BAD_REQUEST);
    }

    // 채용공고 조회
    const existingJobposting = await this.jobpostingRepository.findOne({
      where: { id: jobpostingId },
    });

    if (!existingJobposting) {
      throw new HttpException(
        '채용공고가 존재하지 않습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // 지원내역 조회
    // 지원내역 중복 방지 1건만 가능
    // 해당 사용자의 ID가 지정한 id와 일치하는 경우
    //  지원한 채용공고의 ID가 지정한 jobpostingId와 일치하는 경우
    const existingApplicant = await this.applicantRepository.findOne({
      where: { user: { id }, jobposting: { id: jobpostingId } },
    });

    if (existingApplicant) {
      throw new HttpException(
        '이미 지원한 채용공고 입니다.',
        HttpStatus.FORBIDDEN,
      );
    }

    const apply = await this.applicantRepository.save({
      user: { id },
      jobposting: { id: jobpostingId },
    });

    return this.applicantRepository.save(apply);
  }

  // 채용별 회사 지원 전체 조회 - 회사만
  async findAllApply(id: number, jobpostingId: number): Promise<Applicant[]> {
    const existingApplicant = await this.applicantRepository.findOne({
      where: { jobpostingId },
    });

    if (!existingApplicant) {
      throw new HttpException(
        '채용공고를 찾을 수 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // 채용 공고를 생성한 회사id 찾기
    // 현재 로그인한 회사가 해당 채용공고를 만든 회사가 아니면 오류 반환
    const existingJobposting = await this.jobpostingRepository.findOne({
      where: { id: jobpostingId },
    });

    if (existingJobposting.companyId !== id) {
      throw new HttpException(
        '해당 지원내역에 접근할 수 있는 권한이 없습니다.',
        HttpStatus.FORBIDDEN,
      );
    }

    return await this.applicantRepository.find({
      where: { jobpostingId },
    });
  }

  async removeApply(id: number, jobpostingId: number) {
    const existingJobposting = await this.applicantRepository.findOne({
      where: { jobpostingId },
    });

    if (!existingJobposting) {
      throw new HttpException(
        '지원내역을 찾을 수 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Applicant의 userId와 현재 로그인한 사용자와 비교하여
    // 다른 유저가 삭제할 수 없도록 함
    if (existingJobposting.userId !== id) {
      throw new HttpException('삭제 권한이 없습니다.', HttpStatus.FORBIDDEN);
    }

    return await this.applicantRepository.remove(existingJobposting);
  }
}
