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
  Query,
} from '@nestjs/common';
import { JobpostingService } from './jobposting.service';
import { CreateJobpostingDto } from './dto/create-jobposting.dto';
import { UpdateJobpostingDto } from './dto/update-jobposting.dto';
import { Jobposting } from 'src/domain/jobposting.entity';
import { CompanyGuard } from '../auth/jwt/jwt.company.guard';

@Controller('api/jobpostings')
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

  // 채용공고 전체 조회
  @Get()
  findAllJobposting(@Query('page') page: string) {
    return this.jobpostingService.findAllJobposting({ page: Number(page) });
  }

  // // 회사별 채용공고 전체 조회
  // @Get(':companyId')
  // findCompanyAllJobposting(@Param('companyId') companyId: string) {
  //   return this.jobpostingService.findCompanyAllJobposting(+companyId);
  // }

  // 검색시 해당 검색어를 포함하는 채용 공고글 전체 조회
  @Get()
  findJobPostings(@Body('title') title: string) {
    return this.jobpostingService.findJobPostings(title);
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
