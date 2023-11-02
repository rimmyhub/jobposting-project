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

import { CareerService } from './career.service';
import { CreateCareerDto } from './dto/create-career.dto';
import { UpdateCareerDto } from './dto/update-career.dto';

import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserGuard } from '../auth/jwt/jwt.user.guard';
import { Career } from '../domain/career.entity';

// CareerController 클래스는 각 API의 엔드포인트를 정의한다.
// 즉, 경로를 설정한다고 보면 됨
@Controller('api/careers')
@ApiTags('경력 API')
export class CareerController {
  constructor(private readonly careerService: CareerService) {}

  // 경력 등록
  @UseGuards(UserGuard)
  @Post(':resumeId') // 경력 생성 API 엔드포인트에 이력서 ID 파라미터 추가
  @ApiOperation({
    summary: '(유저가드 적용)경력 작성 API',
    description: '경력 작성',
  })
  @ApiCreatedResponse({ description: '경력 작성', type: Career })
  createCareer(
    @Param('resumeId') resumeId: number, // 이력서 ID 파라미터 받기
    @Body() createCareerDto: CreateCareerDto,
  ) {
    const career = this.careerService.createCareer(+resumeId, createCareerDto);
    return career;
  }

  // 경력 전체 조회
  @Get(':resumeId')
  @ApiOperation({
    summary: '경력 전체조회 API',
    description: '경력 전체조회',
  })
  @ApiCreatedResponse({ description: '경력 전체조회', type: Career })
  findAllCareer(@Param('resumeId') resumeId: number) {
    return this.careerService.findAllCareer(+resumeId);
  }

  // 경력 수정
  @UseGuards(UserGuard)
  @Put(':careerId')
  @ApiOperation({
    summary: '(유저가드 적용)경력 수정 API',
    description: '경력 수정',
  })
  @ApiCreatedResponse({ description: '경력 수정', type: Career })
  updateCareer(
    @Param('careerId') id: string,
    @Body() updateCareerDto: UpdateCareerDto,
  ) {
    return this.careerService.updateCareer(+id, updateCareerDto);
  }

  // 경력 삭제
  @UseGuards(UserGuard)
  @Delete(':careerId')
  @ApiOperation({
    summary: '(유저가드 적용)경력 삭제 API',
    description: '경력 삭제',
  })
  @ApiCreatedResponse({ description: '경력 삭제', type: Career })
  removeCareer(@Param('careerId') id: string) {
    return this.careerService.removeCareer(+id);
  }
}
