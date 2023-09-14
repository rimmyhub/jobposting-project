import { PartialType } from '@nestjs/mapped-types';
import { CreateResumeDto } from './create-resume.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateResumeDto extends PartialType(CreateResumeDto) {
  @ApiProperty({ description: '수정할 이력서 제목' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ description: '수정할 이력서 내용' })
  @IsString()
  @IsOptional()
  content?: string;
}
