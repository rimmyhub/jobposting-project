import { PartialType } from '@nestjs/mapped-types';
import { CreateEducationDto } from './create-education.dto';
import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { educationType } from 'src/commons/enum/education.enums';

export class UpdateEducationDto extends PartialType(CreateEducationDto) {
  @IsString()
  @ApiProperty({ description: '학교이름', required: false })
  @IsOptional()
  schoolTitle?: string;

  @IsString()
  @ApiProperty({ description: '입학년도', required: false })
  @IsOptional()
  admissionYear?: string;

  @IsString()
  @ApiProperty({ description: '졸업년도', required: false })
  @IsOptional()
  graduationYear?: string;

  @IsString()
  @ApiProperty({ description: '전공', required: false })
  @IsOptional()
  major?: string;

  @IsString()
  @ApiProperty({ description: '학력구분', required: false })
  @IsOptional()
  education?: educationType;
}
