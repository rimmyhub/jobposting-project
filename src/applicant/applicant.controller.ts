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
import { Applicant } from 'src/domain/applicant.entity';
import { UserGuard } from 'src/auth/user.guard';
import { CompanyGuard } from 'src/auth/company.guard';

@Controller('applications')
export class ApplicantController {
  constructor(private readonly applicantService: ApplicantService) {}

  // 회사지원하기 - 로그인한 유저만
  @UseGuards(UserGuard)
  @Post(':jobpostingId')
  createApply(
    @Request() req,
    @Param('jobpostingId') jobpostingId: string,
  ): Promise<Applicant> {
    return this.applicantService.createApply(req.user.id, +jobpostingId);
  }

  // 채용공고별 회사지원 조회 하기 - 회사만
  @UseGuards(CompanyGuard)
  @Get(':jobpostingId')
  findAllApply(@Request() req, @Param('jobpostingId') JobpostingId: string) {
    return this.applicantService.findAllApply(req.company.id, +JobpostingId);
  }

  // 회사지원 취소 - 로그인한 유저만
  @UseGuards(UserGuard)
  @Delete(':jobpostingId')
  removeApply(@Request() req, @Param('jobpostingId') JobpostingId: string) {
    return this.applicantService.removeApply(req.user.id, +JobpostingId);
  }
}
