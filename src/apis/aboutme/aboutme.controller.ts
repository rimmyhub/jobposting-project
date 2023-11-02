import {
  Controller,
  Body,
  Param,
  UseGuards,
  Post,
  Request,
  Get,
  Patch,
  Delete,
  Put,
} from '@nestjs/common';
import { UserGuard } from 'src/auth/jwt/jwt.user.guard';
import { AboutmeService } from './aboutme.service';
import { CreateAboutmeDto } from './dto/create-aboutme.dto';
import { Aboutme } from 'src/domain/aboutme.entity';
import { UpdateAboutmeDto } from './dto/update-aboutme.dto';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('/api/aboutmes')
@ApiTags('자기소개서 API')
export class AboutmeController {
  constructor(private readonly aboutmeService: AboutmeService) {}

  // 자기소개서 생성
  @UseGuards(UserGuard)
  @Post(':resumeId')
  @ApiOperation({
    summary: '(유저가드 적용)자기소개서 작성 API',
    description: '자기소개서 작성',
  })
  @ApiCreatedResponse({ description: '자기소개서 작성', type: Aboutme })
  createAboutme(
    @Request() req,
    @Param('resumeId') resumeId: number,
    @Body() createAboutmeDto: CreateAboutmeDto,
  ): Promise<Aboutme> {
    return this.aboutmeService.createAboutme(
      req.user.id,
      +resumeId,
      createAboutmeDto,
    );
  }

  // 자기소개서 조회
  @UseGuards(UserGuard)
  @Get(':resumeId')
  @ApiOperation({
    summary: '(유저가드 적용)자기소개서 조회 API',
    description: '자기소개서 조회',
  })
  @ApiCreatedResponse({ description: '자기소개서 조회', type: Aboutme })
  getAboutme(@Request() req, @Param('resumeId') resumeId: string) {
    return this.aboutmeService.getAboutme(req.user.id, +resumeId);
  }

  // 자기소개서 수정
  @UseGuards(UserGuard)
  @Put(':resumeId/:aboutmeId')
  @ApiOperation({
    summary: '(유저가드 적용)자기소개서 수정 API',
    description: '자기소개서 수정',
  })
  @ApiCreatedResponse({ description: '자기소개서 수정', type: Aboutme })
  updateAboutme(
    @Request() req,
    @Param('resumeId') resumeId: number,
    @Param('aboutmeId') aboutmeId: number,
    @Body() updateAboutmeDto: UpdateAboutmeDto,
  ) {
    return this.aboutmeService.updateAboutme(
      req.user.id,
      +resumeId,
      +aboutmeId,
      updateAboutmeDto,
    );
  }

  // 자기소개서 삭제
  @UseGuards(UserGuard)
  @Delete(':resumeId/:aboutmeId')
  @ApiOperation({
    summary: '(유저가드 적용)자기소개서 삭제 API',
    description: '자기소개서 삭제',
  })
  @ApiCreatedResponse({ description: '자기소개서 삭제', type: Aboutme })
  removeAboutme(
    @Request() req,
    @Param('resumeId') resumeId: number,
    @Param('aboutmeId') aboutmeId: number,
  ) {
    return this.aboutmeService.removeAboutme(
      req.user.id,
      +resumeId,
      +aboutmeId,
    );
  }
}
