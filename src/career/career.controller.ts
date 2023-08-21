import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { Career } from 'src/domain/career.entity';
import { CareerService } from './career.service';
import { CreateCareerDto } from './dto/create-career.dto';
import { UpdateCareerDto } from './dto/update-career.dto';

// CareerController 클래스는 각 API의 엔드포인트를 정의한다.
// 즉, 경로를 설정한다고 보면 됨
@Controller('careers')
export class CareerController {
  constructor(private readonly careerService: CareerService) {}

  // 경력 등록
  @Post(':resumeId')
  createCareer(@Body() createCareerDto: CreateCareerDto): Promise<Career> {
    const career = this.careerService.createCareer(createCareerDto);
    return career;
  }

  // 경력 전체 조회
  @Get(':resumeId')
  findAllCareer() {
    return this.careerService.findAllCareer();
  }

  // 경력 수정
  @Patch(':careerId')
  updateCareer(
    @Param(':careerId') id: string,
    @Body() updateCareerDto: UpdateCareerDto,
  ) {
    return this.careerService.updateCareer(+id, updateCareerDto);
  }

  // 경력 삭제
  @Delete(':careerId')
  removeCareer(@Param(':careerId') id: string) {
    return this.careerService.removeCareer(+id);
  }
}
