import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MinLength,
  IsBoolean, // isVerified 값을 위해 추가했습니다.
} from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty()
  @IsEmail({})
  @ApiProperty({ description: '이메일' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5) //최솟값
  @Matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{4,25}$/)
  @ApiProperty({ description: '비밀번호' })
  password: string;

  @IsString()
  @ApiProperty({ description: '이미지' })
  image: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '이름' })
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '소개' })
  introduction: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'URL' })
  website: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '주소' })
  address: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '사업분야' })
  business: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '직원수' })
  employees: string;

  @IsBoolean() // 추가: isVerified 값을 위한 decorator
  @ApiProperty({ description: '인증값' })
  isVerified: boolean; // 추가: isVerified 필드
}
