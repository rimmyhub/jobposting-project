import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApplicantService } from './applicant.service';
import { CreateApplicantDto } from './dto/create-applicant.dto';
import { Applicant } from 'src/domain/applicant.entity';

@Controller('applicants')
export class ApplicantController {
  constructor(private readonly applicantService: ApplicantService) {}

  // 채용공고 지원하기
  @Post('/jobpostings/:JobpostingId/:ApplicationId')
  createApply(
    @Body() createApplicantDto: CreateApplicantDto,
  ): Promise<Applicant> {
    return this.applicantService.createApply(createApplicantDto);
  }
}
