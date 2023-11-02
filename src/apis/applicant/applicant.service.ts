import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { CreateApplicantDto } from './dto/create-applicant.dto';
import { User } from '../domain/user.entity';

import { HttpException, HttpStatus } from '@nestjs/common';
import { Applicant } from '../domain/applicant.entity';
import { Jobposting } from '../domain/jobposting.entity';

export class ApplicantService {
  constructor(
    @InjectRepository(Applicant)
    private readonly applicantRepository: Repository<Applicant>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Jobposting)
    private readonly jobpostingRepository: Repository<Jobposting>,
  ) {}

  // 내가 지원한 공고 가져오기
  async getJobpostingById(id: string) {
    const applications = await this.applicantRepository.find({
      where: { userId: id },
      relations: ['jobposting'], // 채용공고 정보를 함께 가져오기 위해 관계 설정
    });

    const jobpostings = applications.map(
      (application) => application.jobposting,
    );

    return jobpostings;
  }

  // 지원하기
  async createApply(id: string, jobpostingId: number): Promise<Applicant> {
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

    return apply;
  }

  // // 회사 지원내역 전체보기
  // async getApplies(id: number) {
  //   return await this.applicantRepository.findOne({
  //     where: { id },
  //   });
  // }

  // 회사지원 조회 하기 - 유저
  async findAllUserApply(
    id: string,
    jobpostingId: number,
  ): Promise<Jobposting> {
    const existingApplicant = await this.applicantRepository.findOne({
      where: { userId: id, jobpostingId },
      relations: ['jobposting'], // 관련 엔티티 이름을 지정
    });

    if (!existingApplicant) {
      throw new HttpException(
        '채용공고를 찾을 수 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return existingApplicant.jobposting; //jobposting 반환
  }

  // 채용별 회사 지원 전체 조회 - 회사만
  async findAllCompanyApply(
    id: string,
    jobpostingId: number,
  ): Promise<Applicant[]> {
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

  // 채용공고에 지원한 모든 유저 조회
  async findApplyUser(id: string, jobpostingId: number) {
    const applicants = await this.applicantRepository.find({
      where: { jobpostingId },
      relations: ['user'], // User 관계 로드
    });
    if (!applicants) {
      throw new HttpException(
        '지원한 구직자가 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return applicants;
  }

  // ===========

  // async findAllResume(): Promise<Resume[]> {
  // const result = await this.resumeRepository
  // .createQueryBuilder('resume')
  // .select([
  // 'resume.id',
  // 'resume.title',
  // 'resume.userId',
  // 'resume.content',
  // 'user.name',
  // 'user.id',
  // ]) // user테이블의 name만 가져오기
  // .innerJoin('resume.user', 'user') // user테이블과 join
  // .where('resume.deletedAt IS NULL') // deleteAt에 null값이 들어있는 데이터만 가져오기
  // .getMany();

  // return result;
  // }

  async removeApply(id: string, jobpostingId: number) {
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
