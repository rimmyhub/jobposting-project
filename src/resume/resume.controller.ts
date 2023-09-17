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
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('/api/resumes')
@ApiTags('이력서 API')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  // 이력서 - 작성
  @UseGuards(UserGuard)
  @Post()
  @ApiOperation({
    summary: '이력서 작성 API',
    description: '유저의 이력서 작성',
  })
  @ApiCreatedResponse({ description: '유저의 이력서 작성', type: Resume })
  async createResume(
    @Request() req,
    @Body() createResumeDto: CreateResumeDto,
  ): Promise<Resume> {
    return await this.resumeService.createResume(req.user.id, createResumeDto);
  }

  // 이력서 - 전체 조회
  @Get()
  @ApiOperation({
    summary: '이력서 전체조회 API',
    description: '이력서 전체 조회',
  })
  @ApiCreatedResponse({ description: '이력서 전체 조회', type: Resume })
  async findAllResume(): Promise<Resume[]> {
    return await this.resumeService.findAllResume();
  }

  // 이력서 - 상세 조회
  @Get(':resumeId')
  @ApiOperation({
    summary: '이력서 상세조회 API',
    description: '이력서 상세 조회',
  })
  @ApiCreatedResponse({ description: '이력서 상세 조회', type: Resume })
  async findOneResume(@Param('resumeId') resumeId: number) {
    return await this.resumeService.findOneResume(+resumeId);
  }

  // 이력서 - 유저 이력서 ID 조회
  @Get('user/:userId')
  @ApiOperation({
    summary: '유저의 이력서 ID 조회',
    description: '유저의 이력서 ID 조회',
  })
  @ApiCreatedResponse({ description: '유저의 이력서 ID 조회' })
  async findResumeId(@Param('userId') userId: string) {
    return await this.resumeService.findResumeId(userId);
  }

  // 이력서 - 수정
  @UseGuards(UserGuard)
  @Put(':resumeId')
  @ApiOperation({
    summary: '이력서 수정 API',
    description: '유저의 이력서 수정',
  })
  @ApiCreatedResponse({ description: '유저의 이력서 수정', type: Resume })
  updateResume(
    @Param('resumeId') resumeId: number,
    @Body() updateResumeDto: UpdateResumeDto,
  ) {
    return this.resumeService.updateResume(+resumeId, updateResumeDto);
  }

  // 이력서 - 삭제
  @UseGuards(UserGuard)
  @Delete(':resumeId')
  @ApiOperation({
    summary: '이력서 삭제 API',
    description: '유저의 이력서 삭제',
  })
  @ApiCreatedResponse({ description: '유저의 이력서 삭제', type: Resume })
  removeResume(@Param('resumeId') resumeId: number) {
    return this.resumeService.removeResume(+resumeId);
  }

  // 이력서 - 유저의 이력서 ID 조회 (UserGuard 적용)
  @UseGuards(UserGuard)
  @Get('user-guard/:userId') // 엔드포인트 경로를 구분
  @ApiOperation({
    summary: '유저의 이력서 ID 조회 (UserGuard 적용)',
    description: '유저의 이력서 ID 조회 (UserGuard 적용)',
  })
  @ApiCreatedResponse({ description: '유저의 이력서 ID 조회 (UserGuard 적용)' })
  async findResumeIdWithGuard(@Param('userId') userId: string) {
    return await this.resumeService.findResumeIdWithGuard(userId);
  }
}
