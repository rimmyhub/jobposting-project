import { PartialType } from '@nestjs/mapped-types';
import { CreateAboutmeDto } from './create-aboutme.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateAboutmeDto extends PartialType(CreateAboutmeDto) {
  @ApiProperty({ description: '수정할 자소서 제목', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ description: '수정할 자소서 내용', required: false })
  @IsString()
  @IsOptional()
  content?: string;
}
