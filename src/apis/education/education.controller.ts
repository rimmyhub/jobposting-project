import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { EducationService } from './education.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserGuard } from '../auth/jwt/jwt.user.guard';

@Controller('api/educations')
@ApiTags('학력 API')
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  // 학력 - 등록
  @UseGuards(UserGuard)
  @Post('/:resumeId')
  @ApiOperation({ summary: '학력생성 API', description: '학력생성' })
  @ApiCreatedResponse({ description: '학력생성' })
  createEducation(
    @Body() createEducationDto: CreateEducationDto,
    @Param('resumeId') resumeId: number,
  ) {
    return this.educationService.createEducation(+resumeId, createEducationDto);
  }

  // 학력 - 조회
  @Get('/:resumeId')
  @ApiOperation({ summary: '학력 조회 API', description: '학력 조회' })
  @ApiCreatedResponse({ description: '학력 조회' })
  findEducation(@Param('resumeId') resumeId: number) {
    return this.educationService.findEducation(+resumeId);
  }

  // 학력 - 수정
  @UseGuards(UserGuard)
  @Put('/:educationId')
  @ApiOperation({ summary: '학력 수정 API', description: '학력 수정' })
  @ApiCreatedResponse({ description: '학력 수정' })
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
  @ApiOperation({ summary: '학력 삭제 API', description: '학력 삭제' })
  @ApiCreatedResponse({ description: '학력 삭제' })
  removeEducation(@Param('educationId') educationId: number) {
    return this.educationService.removeEducation(+educationId);
  }
}
