import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyDto } from './create-company.dto';
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {
  @IsEmail({})
  @ApiProperty({ description: '이메일', required: false })
  @IsOptional()
  email?: string;

  @IsString()
  @MinLength(5) //최솟값
  @Matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{4,25}$/)
  @ApiProperty({ description: '비밀번호', required: false })
  @IsOptional()
  password?: string;

  @IsString()
  @ApiProperty({ description: '이미지', required: false })
  @IsOptional()
  image?: string;

  @IsString()
  @ApiProperty({ description: '이름', required: false })
  @IsOptional()
  title?: string;

  @IsString()
  @ApiProperty({ description: '소개', required: false })
  @IsOptional()
  introduction?: string;

  @IsString()
  @ApiProperty({ description: 'URL', required: false })
  @IsOptional()
  website?: string;

  @IsString()
  @ApiProperty({ description: '주소', required: false })
  @IsOptional()
  address?: string;

  @IsString()
  @ApiProperty({ description: '사업분야', required: false })
  @IsOptional()
  business?: string;

  @IsString()
  @ApiProperty({ description: '직원수', required: false })
  @IsOptional()
  employees?: string;

  @IsBoolean() // 추가: isVerified 값을 위한 decorator
  @ApiProperty({ description: '인증값', required: false })
  @IsOptional()
  isVerified?: boolean; // 추가: isVerified 필드
}
