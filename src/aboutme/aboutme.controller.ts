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

@Controller('/api/aboutmes')
export class AboutmeController {
  constructor(private readonly aboutmeService: AboutmeService) {}

  // 자기소개서 생성
  @UseGuards(UserGuard)
  @Post(':resumeId')
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
  getAboutme(@Request() req, @Param('resumeId') resumeId: string) {
    return this.aboutmeService.getAboutme(req.user.id, +resumeId);
  }

  // 자기소개서 수정
  @UseGuards(UserGuard)
  @Put(':resumeId/:aboutmeId')
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
