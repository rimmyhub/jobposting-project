import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// CreateUserDto에서 상속을 받는데 값을 다 입력하지 않아도 된다.
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsEmail({}) // 이메일은 이메일형식으로만 받기
  @ApiProperty({ description: '이메일' })
  email?: string;

  @IsString()
  @ApiProperty({ description: '이미지' })
  image?: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  @Matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{4,25}$/) // <= Matches 안에 정규표현식을 쓸 수 있다.
  @ApiProperty({ description: '비밀번호' })
  password?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  @MinLength(2)
  @ApiProperty({ description: '이름' })
  name?: string;

  @IsOptional()
  @Matches(/^\d{3}-\d{3,4}-\d{4}$/)
  @ApiProperty({ description: '전화번호' })
  phone?: string;

  @IsOptional()
  @MaxLength(1)
  @ApiProperty({ description: '성별' })
  gender?: string;

  @IsOptional()
  @ApiProperty({ description: '주소' })
  address?: string;

  // 생년월일 정규표현식 예) 1999-05-05
  // @Matches(/^\d{4}\d{2}\d{2}$/)
  @IsOptional()
  @Matches(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)
  @ApiProperty({ description: '생년월일' })
  birth?: string;

  @IsBoolean() // 추가: isVerified 값을 위한 decorator
  @ApiProperty({ description: '인증여부' })
  isVerified?: boolean; // 추가: isVerified 필드
}
