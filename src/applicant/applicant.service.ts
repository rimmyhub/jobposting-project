import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { CreateApplicantDto } from './dto/create-applicant.dto';
import { Applicant } from 'src/domain/applicant.entity';

export class ApplicantService {
  constructor(
    @InjectRepository(Applicant)
    private readonly applicantRepository: Repository<Applicant>,
  ) {}

  // async createApply(id: number, jobpostingId: number): Promise<Applicant> {
  //   const apply = await this.applicantRepository.save({
  //     user: { id: userId },
  //     jobposting: { id: jobpostingId },
  //   });
  //   return apply;
  // }
}
