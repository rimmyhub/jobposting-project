import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { CreateApplicantDto } from './dto/create-applicant.dto';
import { Applicant } from 'src/domain/applicant.entity';

export class ApplicantService {
  constructor(
    @InjectRepository(Applicant)
    private readonly applicantRepository: Repository<Applicant>,
  ) {}

  async createApply(
    createApplicantDto: CreateApplicantDto,
  ): Promise<Applicant> {
    const { userId, jobpostingId } = createApplicantDto;
    const apply = this.applicantRepository.create({ userId, jobpostingId });

    return await this.applicantRepository.save(apply);
  }
}
