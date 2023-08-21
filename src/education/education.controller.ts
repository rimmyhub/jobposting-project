import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { EducationService } from './education.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { UserGuard } from 'src/auth/jwt/jwt.user.guard';

@Controller('/educations')
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  // 학력 - 등록
  @UseGuards(UserGuard)
  @Post('/:resumeId')
  createEducation(
    @Body() createEducationDto: CreateEducationDto,
    @Param('resumeId') resumeId: number,
  ) {
    return this.educationService.createEducation(+resumeId, createEducationDto);
  }

  // 학력 - 조회
  @Get('/:resumeId')
  findEducation(@Param('resumeId') resumeId: number) {
    return this.educationService.findEducation(+resumeId);
  }

  // 학력 - 수정
  @UseGuards(UserGuard)
  @Patch('/:educationId')
  updateEducation(
    @Param('educationId') educationId: number,
    @Body() updateEducationDto: UpdateEducationDto,
  ) {
    return this.educationService.updateEducation(
      +educationId,
      updateEducationDto,
    );
  }

  // 학력 - 삭제
  @UseGuards(UserGuard)
  @Delete('/:educationId')
  removeEducation(@Param('educationId') educationId: number) {
    return this.educationService.removeEducation(+educationId);
  }
}
