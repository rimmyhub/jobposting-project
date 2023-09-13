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
import { ParamDto } from 'src/utils/param.dto';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('api/jobpostings')
@ApiTags('채용공고 API')
export class JobpostingController {
  constructor(private readonly jobpostingService: JobpostingService) {}

  // 윤영 : 검색시 해당 검색어를 포함하는 채용 공고글 전체 조회
  @Post('search')
  @ApiOperation({
    summary: '채용공고 검색 API',
    description: '채용공고 검색',
  })
  @ApiCreatedResponse({ description: '채용공고 검색' })
  searchKeyword(@Body('keyword') keyword: string) {
    return this.jobpostingService.searchKeyword(keyword);
  }

  // 윤영 : 옵션설정시 해당 옵션을 포함하는 채용공고글 전체 조회
  @Post('option')
  @ApiOperation({
    summary: '채용공고 옵션 검색 API',
    description: '채용공고 옵션 검색',
  })
  @ApiCreatedResponse({ description: '채용공고 옵션 검색' })
  searchOption(
    @Body('occupation') occupation: string,
    @Body('workArea') workArea: string,
    @Body('experience') experience: string,
  ) {
    return this.jobpostingService.searchOption(
      occupation,
      workArea,
      experience,
    );
  }

  // // 윤영 : 직군 선택시 채용공고 직군과 일치한 채용공고 전체 조회
  // @Post('job')
  // searchOccupation(@Body('job') job: string) {
  //   return this.jobpostingService.searchOccupation(job);
  // }

  // // 윤영 : 지역 + 경력 일치하는 채용 공고글 전체 조회
  // @Post('selectJobposting')
  // searchSelectJobposting(
  //   @Body('career') career: string,
  //   @Body('workArea') workArea: string,
  // ) {
  //   return this.jobpostingService.searchSelectJobposting(career, workArea);
  // }

  // // 윤영 : 지역검색시 해당지역과 일치하는 채용 공고글 전체 조회
  // @Post('workArea')
  // searchRegion(@Body('workArea') workArea: string) {
  //   return this.jobpostingService.searchRegion(workArea);
  // }

  // // 윤영 : 경력검색시 해당경력과 일치하는 채용 공고글 전체 조회
  // @Post('career')
  // searchCareer(@Body('career') career: string) {
  //   return this.jobpostingService.searchCareer(career);
  // }

  // 채용공고 아이디 가져오기
  @Get('getId')
  @ApiOperation({
    summary: '채용공고 아이디조회 API',
    description: '채용공고 아이디조회',
  })
  @ApiCreatedResponse({ description: '채용공고 아이디조회' })
  getJobpostingId(@Query('id') id: string) {
    return this.jobpostingService.getJobpostingId({ id: Number(id) });
  }

  // 회사별 채용공고 생성 (회사 연결)
  @UseGuards(CompanyGuard)
  @Post()
  @ApiOperation({
    summary: '채용공고 생성 API',
    description: '채용공고 생성',
  })
  @ApiCreatedResponse({ description: '채용공고 생성' })
  createJobposting(
    @Request() req,
    @Body() createJobpostingDto: CreateJobpostingDto,
  ): Promise<Jobposting> {
    const companyId = req.company.id;
    return this.jobpostingService.createJobposting(
      companyId,
      createJobpostingDto,
    );
  }

  // 채용공고 전체 조회
  @Get()
  @ApiOperation({
    summary: '채용공고 전체조회 API',
    description: '채용공고 전체조회',
  })
  @ApiCreatedResponse({ description: '채용공고 전체조회' })
  findAllJobposting(@Query('page') page: string) {
    return this.jobpostingService.findAllJobposting({ page: Number(page) });
  }

  // 회사별 채용공고 전체 조회
  @UseGuards(CompanyGuard)
  @Get('company')
  @ApiOperation({
    summary: '채용공고 전체조회 API',
    description: '채용공고 전체조회(컴퍼니가드)',
  })
  @ApiCreatedResponse({ description: '채용공고 전체조회(컴퍼니가드)' })
  findCompanyAllJobposting(@Request() req) {
    return this.jobpostingService.findCompanyAllJobposting(req.company.id);
  }

  // 회사별 채용공고 전체 조회 (소프트 딜리트된 데이터만 조회)
  @UseGuards(CompanyGuard)
  @Get('company/delete')
  @ApiOperation({
    summary: '삭제된 채용공고 조회 API',
    description: '삭제된 채용공고 조회',
  })
  @ApiCreatedResponse({ description: '삭제된 채용공고 조회' })
  findCompanyAllDeletedJobposting(@Request() req) {
    return this.jobpostingService.findCompanyAllJobpostingDelete(
      req.company.id,
    );
  }

  // 특정 회사 ID를 기준으로 해당 companyId를 가진 모든 채용 공고 조회
  @Get('company/:companyId')
  @ApiOperation({
    summary: '회사ID기준 채용공고 조회 API',
    description: '회사ID기준 채용공고 조회',
  })
  @ApiCreatedResponse({ description: '회사ID기준 채용공고 조회' })
  findJobpostingsByCompanyId(@Param('companyId') companyId: string) {
    return this.jobpostingService.findJobpostingsByCompanyId(companyId);
  }

  // // 윤영 : 메인페이지에서 채용공고 클릭 시 해당 채용공고 내용 조회
  // @Get('/:jobpostingId')

  // getJobposting(@Param('jobpostingId') jobpostingId: string) {
  //   return this.jobpostingService.getJobposting(+jobpostingId);
  // }

  // 채용공고 1개 조회 - 회사
  @UseGuards(CompanyGuard)
  @Get('/company/:jobpostingId')
  @ApiOperation({
    summary: '채용공고 상세조회 API',
    description: '채용공고 상세조회',
  })
  @ApiCreatedResponse({ description: '채용공고 상세조회' })
  findOneJobposting(
    @Request() req,
    @Param('jobpostingId') jobpostingId: string,
  ) {
    const companyId = req.company.id;
    return this.jobpostingService.findOneJobposting(companyId, +jobpostingId);
  }

  // 채용공고 수정
  @UseGuards(CompanyGuard)
  @Patch(':jobpostingId')
  @ApiOperation({
    summary: '채용공고 수정 API',
    description: '채용공고 수정',
  })
  @ApiCreatedResponse({ description: '채용공고 수정' })
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
  @ApiOperation({
    summary: '채용공고 삭제 API',
    description: '채용공고 삭제',
  })
  @ApiCreatedResponse({ description: '채용공고 삭제' })
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
