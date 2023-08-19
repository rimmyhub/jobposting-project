import { CreateJobpostingDto } from './dto/create-jobposting.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Jobposting } from 'src/domain/jobposting.entity';
import { Repository } from 'typeorm';
import { UpdateJobpostingDto } from './dto/update-jobposting.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Company } from 'src/domain/company.entity';

export class JobpostingService {
  constructor(
    @InjectRepository(Jobposting)
    private readonly jobpostingRepository: Repository<Jobposting>,
  ) {}

  // 채용 공고 생성
  async createJobposting(
    companyId: number,
    createJobpostingDto: CreateJobpostingDto,
  ): Promise<Jobposting> {
    const {
      title,
      career,
      salary,
      education,
      job,
      workType,
      workArea,
      content,
      Deadline,
    } = createJobpostingDto;

    const jobposting = this.jobpostingRepository.create({
      companyId,
      title,
      career,
      salary,
      education,
      job,
      workType,
      workArea,
      content,
      Deadline,
    });

    await this.jobpostingRepository.save(jobposting);
    return jobposting;
  }

  // 채용공고 전체 조회
  async findAllJobposting(companyId: number): Promise<Jobposting[]> {
    return await this.jobpostingRepository.find({ where: { companyId } });
  }

  // 채용공고 1개 조회
  async findOneJobposting(companyId: number, id: number): Promise<Jobposting> {
    return await this.jobpostingRepository.findOne({
      where: { companyId, id },
    });
  }

  // 채용공고 수정
  async updateJobposting(id: number, updateJobpostingDto: UpdateJobpostingDto) {
    const jobposting = await this.jobpostingRepository.findOne({
      where: { id },
    });

    if (!jobposting) {
      throw new HttpException(
        '채용 공고를 찾을 수 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
    Object.assign(jobposting, updateJobpostingDto);
    return await this.jobpostingRepository.save(jobposting);
  }

  // 채용공고 삭제
  async removeJobposting(id: number) {
    const jobposting = await this.jobpostingRepository.findOne({
      where: { id },
    });
    if (!jobposting) {
      throw new HttpException(
        '채용 공고를 찾을 수 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.jobpostingRepository.remove(jobposting);
  }
}
