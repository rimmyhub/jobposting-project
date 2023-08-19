import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApplicantService } from './applicant.service';
import { CreateApplicantDto } from './dto/create-applicant.dto';
import { Applicant } from 'src/domain/applicant.entity';
import { CompanyGuard } from 'src/auth/company.guard';

@Controller('applications')
export class ApplicantController {
  constructor(private readonly applicantService: ApplicantService) {}

  // // 채용공고 지원하기
  // @UseGuards(CompanyGuard)
  // @Post(':jobpostingId')
  // createApply(
  //   @Request() req,
  //   @Param('jobpostingId') jobpostingId: string,
  // ): Promise<Applicant> {
  //   return this.applicantService.createApply(req.company.id, +jobpostingId);
  // }
}
