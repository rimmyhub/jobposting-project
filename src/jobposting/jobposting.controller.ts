import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { JobpostingService } from './jobposting.service';
import { CreateJobpostingDto } from './dto/create-jobposting.dto';
import { UpdateJobpostingDto } from './dto/update-jobposting.dto';
import { Jobposting } from 'src/domain/jobposting.entity';

@Controller('jobpostings')
export class JobpostingController {
  constructor(private readonly jobpostingService: JobpostingService) {}

  // 채용공고 생성
  @Post()
  createJobposting(
    @Body() createJobpostingDto: CreateJobpostingDto,
  ): Promise<Jobposting> {
    return this.jobpostingService.createJobposting(createJobpostingDto);
  }

  // 채용공고 전체 조회
  @Get()
  findAllJobposting() {
    return this.jobpostingService.findAllJobposting();
  }

  // 채용공고 1개 조회
  @Get(':id')
  findOneJobposting(@Param('id') id: string) {
    return this.jobpostingService.findOneJobposting(+id);
  }

  // 채용공고 수정
  @Patch(':id')
  updateJobposting(
    @Param('id') id: string,
    @Body() updateJobpostingDto: UpdateJobpostingDto,
  ) {
    return this.jobpostingService.updateJobposting(+id, updateJobpostingDto);
  }

  // 채용공고 삭제
  @Delete(':id')
  removeJobposting(@Param('id') id: string) {
    return this.jobpostingService.removeJobposting(+id);
  }
}
