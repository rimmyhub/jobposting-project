// PartialType을 사용하여 CreateCareerDto 클래스를 상속.
// PartialType을 사용하면 CreateCareerDto의 필드 중에서 일부만 업데이트할 수 있다.
// CreateCareerDto의 필드에 변경이 있을 때 자동으로 UpdateCareerDto에도 반영된다.

import { PartialType } from '@nestjs/mapped-types';
import { CreateCareerDto } from './create-career.dto';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCareerDto extends PartialType(CreateCareerDto) {
  @IsOptional()
  @IsString()
  @ApiProperty({ description: '회사 이름', required: false })
  companyTitle?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '직무', required: false })
  job?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ description: '입사날짜', required: false })
  joiningDate?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ description: '퇴사날짜', required: false })
  resignationDate?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '직책', required: false })
  position?: string;
}
