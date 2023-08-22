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

import { CareerService } from './career.service';
import { CreateCareerDto } from './dto/create-career.dto';
import { UpdateCareerDto } from './dto/update-career.dto';
import { UserGuard } from 'src/auth/jwt/jwt.user.guard';

// CareerController 클래스는 각 API의 엔드포인트를 정의한다.
// 즉, 경로를 설정한다고 보면 됨
@Controller('api/careers')
export class CareerController {
  constructor(private readonly careerService: CareerService) {}

  // 경력 등록
  @UseGuards(UserGuard)
  @Post(':resumeId') // 경력 생성 API 엔드포인트에 이력서 ID 파라미터 추가
  createCareer(
    @Param('resumeId') resumeId: number, // 이력서 ID 파라미터 받기
    @Body() createCareerDto: CreateCareerDto,
  ) {
    const career = this.careerService.createCareer(+resumeId, createCareerDto);
    return career;
  }

  // 경력 전체 조회
  @Get(':resumeId')
  findAllCareer(@Param('resumeId') resumeId: number) {
    return this.careerService.findAllCareer(+resumeId);
  }

  // 경력 수정
  @UseGuards(UserGuard)
  @Patch(':careerId')
  updateCareer(
    @Param('careerId') id: string,
    @Body() updateCareerDto: UpdateCareerDto,
  ) {
    return this.careerService.updateCareer(+id, updateCareerDto);
  }

  // 경력 삭제
  @UseGuards(UserGuard)
  @Delete(':careerId')
  removeCareer(@Param('careerId') id: string) {
    return this.careerService.removeCareer(+id);
  }
}
