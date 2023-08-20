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
import { JobpostingService } from './jobposting.service';
import { CreateJobpostingDto } from './dto/create-jobposting.dto';
import { UpdateJobpostingDto } from './dto/update-jobposting.dto';
import { Jobposting } from 'src/domain/jobposting.entity';
import { CompanyGuard } from 'src/auth/company.guard';

@Controller('jobpostings')
export class JobpostingController {
  constructor(private readonly jobpostingService: JobpostingService) {}

  // 회사별 채용공고 생성 (회사 연결)
  @UseGuards(CompanyGuard)
  @Post(':companyId')
  createJobposting(
    @Request() req,
    @Param('companyId') companyId: string,
    @Body() createJobpostingDto: CreateJobpostingDto,
  ): Promise<Jobposting> {
    return this.jobpostingService.createJobposting(
      req.company.id,
      +companyId,
      createJobpostingDto,
    );
  }

  // 회사별 채용공고 전체 조회
  @Get(':companyId')
  findAllJobposting(@Param('companyId') companyId: string) {
    return this.jobpostingService.findAllJobposting(+companyId);
  }

  // 회사별 채용공고 1개 조회
  @Get(':companyId/:jobpostingId')
  findOneJobposting(
    @Param('companyId') companyId: string,
    @Param('jobpostingId') jobpostingId: string,
  ) {
    return this.jobpostingService.findOneJobposting(+companyId, +jobpostingId);
  }

  // 채용공고 수정
  @UseGuards(CompanyGuard)
  @Patch(':jobpostingId')
  updateJobposting(
    @Param('jobpostingId') jobpostingId: string,
    @Request() req,
    @Body() updateJobpostingDto: UpdateJobpostingDto,
  ) {
    return this.jobpostingService.updateJobposting(
      +jobpostingId,
      req.company.id,
      updateJobpostingDto,
    );
  }

  // 채용공고 삭제
  @UseGuards(CompanyGuard)
  @Delete(':jobpostingId')
  removeJobposting(
    @Param('jobpostingId') jobpostingId: string,
    @Request() req,
  ) {
    return this.jobpostingService.removeJobposting(
      +jobpostingId,
      req.company.id,
    );
  }
}
