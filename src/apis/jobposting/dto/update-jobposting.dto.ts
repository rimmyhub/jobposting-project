import { PartialType } from '@nestjs/mapped-types';
import { CreateJobpostingDto } from './create-jobposting.dto';
import { IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateJobpostingDto extends PartialType(CreateJobpostingDto) {
  @IsOptional()
  @IsString()
  @ApiProperty({ description: '제목' })
  title?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '경력' })
  career?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '연봉' })
  salary?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '학력' })
  education?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '분야' })
  job?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '경력' })
  workType?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '지역' })
  workArea?: string;

  @IsOptional()
  @IsString()
  @MinLength(10) //최솟값
  @ApiProperty({ description: '내용' })
  content?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '마감일' })
  dueDate?: string;
}
