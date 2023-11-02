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
import { UserGuard } from '../auth/jwt/jwt.user.guard';
import { CompanyGuard } from '../auth/jwt/jwt.company.guard';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Jobposting } from '../domain/jobposting.entity';
import { Applicant } from '../domain/applicant.entity';

@Controller('api/applications')
@ApiTags('지원공고 API')
export class ApplicantController {
  constructor(private readonly applicantService: ApplicantService) {}

  // 내가 지원한 공고 가져오기
  @UseGuards(UserGuard)
  @Get('user')
  @ApiOperation({
    summary: '(유저가드 적용)지원공고 조회 API',
    description: '지원공고 조회',
  })
  @ApiCreatedResponse({ description: '지원공고 조회', type: Jobposting })
  getJobpostingById(@Request() req) {
    return this.applicantService.getJobpostingById(req.user.id);
  }

  // 회사지원하기 - 로그인한 유저만
  @UseGuards(UserGuard)
  @Post(':jobpostingId')
  @ApiOperation({
    summary: '(유저가드 적용)회사지원 API',
    description: '회사지원',
  })
  @ApiCreatedResponse({ description: '회사지원' })
  createApply(
    @Request() req,
    @Param('jobpostingId') jobpostingId: string,
  ): Promise<Applicant> {
    return this.applicantService.createApply(req.user.id, +jobpostingId);
  }

  // 회사지원 조회 하기 - 유저
  @UseGuards(UserGuard)
  @Get('user/:jobpostingId')
  @ApiOperation({
    summary: '(유저가드 적용)사용자가 지원한 회사 채용공고 조회 API',
    description: '사용자가 지원한 회사 채용공고 조회',
  })
  @ApiCreatedResponse({
    description: '사용자가 지원한 회사 채용공고 조회',
    type: Jobposting,
  })
  findAllUserApply(
    @Request() req,
    @Param('jobpostingId') jobpostingId: string,
  ) {
    return this.applicantService.findAllUserApply(req.user.id, +jobpostingId);
  }

  // 채용공고별 회사지원 조회 하기 - 회사만
  @UseGuards(CompanyGuard)
  @Get('company/:jobpostingId')
  @ApiOperation({
    summary: '(컴퍼니가드 적용)회사에 지원한 지원서 조회 API',
    description: '회사에 지원한 지원서 조회',
  })
  @ApiCreatedResponse({
    description: '회사에 지원한 지원서 조회',
  })
  findAllCompanyApply(
    @Request() req,
    @Param('jobpostingId') JobpostingId: string,
  ) {
    return this.applicantService.findAllCompanyApply(
      req.company.id,
      +JobpostingId,
    );
  }

  // 채용공고에 지원한 모든 유저 조회
  @UseGuards(CompanyGuard)
  @Get('applyuser/:jobpostingId')
  @ApiOperation({
    summary: '(컴퍼니가드 적용)채용공고에 지원한 유저 조회 API',
    description: '채용공고에 지원한 유저 조회',
  })
  @ApiCreatedResponse({ description: '채용공고에 지원한 유저 조회' })
  findApplyUsers(@Request() req, @Param('jobpostingId') jobpostingId: number) {
    return this.applicantService.findApplyUser(req.company.id, +jobpostingId);
  }

  // 회사지원 취소 - 로그인한 유저만
  @UseGuards(UserGuard)
  @Delete(':jobpostingId')
  @ApiOperation({
    summary: '(유저가드 적용)지원공고 취소 API',
    description: '지원공고 취소',
  })
  @ApiCreatedResponse({ description: '지원공고 취소', type: Jobposting })
  removeApply(@Request() req, @Param('jobpostingId') JobpostingId: string) {
    return this.applicantService.removeApply(req.user.id, +JobpostingId);
  }
}
