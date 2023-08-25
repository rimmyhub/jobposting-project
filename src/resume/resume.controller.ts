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
  Put,
} from '@nestjs/common';
import { ResumeService } from './resume.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { UserGuard } from 'src/auth/jwt/jwt.user.guard';
import { Resume } from 'src/domain/resume.entity';

@Controller('/api/resumes')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  // 이력서 - 작성
  @UseGuards(UserGuard)
  @Post()
  async createResume(
    @Request() req,
    @Body() createResumeDto: CreateResumeDto,
  ): Promise<Resume> {
    return await this.resumeService.createResume(req.user.id, createResumeDto);
  }

  // 이력서 - 전체 조회
  @Get()
  async findAllResume(): Promise<Resume[]> {
    return await this.resumeService.findAllResume();
  }

  // 이력서 - 상세 조회
  @Get(':resumeId')
  async findOneResume(@Param('resumeId') resumeId: number) {
    return await this.resumeService.findOneResume(+resumeId);
  }

  // 이력서 - 수정
  @UseGuards(UserGuard)
  @Put(':resumeId')
  updateResume(
    @Param('resumeId') resumeId: number,
    @Body() updateResumeDto: UpdateResumeDto,
  ) {
    return this.resumeService.updateResume(+resumeId, updateResumeDto);
  }

  // 이력서 - 삭제
  @UseGuards(UserGuard)
  @Delete(':resumeId')
  removeResume(@Param('resumeId') resumeId: number) {
    return this.resumeService.removeResume(+resumeId);
  }
}
