import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  IsNotEmpty,
  IsBoolean, // isVerified 값을 위해 추가했습니다.
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail({}) // 이메일은 이메일형식으로만 받기
  @ApiProperty({ description: '이메일' })
  email: string;

  @IsString()
  @ApiProperty({ description: '이미지' })
  image: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @Matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{4,25}$/) // <= Matches 안에 정규표현식을 쓸 수 있다.
  @ApiProperty({ description: '비밀번호' })
  password: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  @MinLength(2)
  @ApiProperty({ description: '이름' })
  name: string;

  @IsNotEmpty()
  @Matches(/^\d{3}-\d{3,4}-\d{4}$/)
  @ApiProperty({ description: '전화번호' })
  phone: string;

  @IsNotEmpty()
  @MaxLength(1)
  @ApiProperty({ description: '성별' })
  gender: string;

  @IsNotEmpty()
  @ApiProperty({ description: '주소' })
  address: string;

  // 생년월일 정규표현식 예) 1999-05-05
  // @Matches(/^\d{4}\d{2}\d{2}$/)
  @IsNotEmpty()
  @Matches(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)
  @ApiProperty({ description: '생년월일' })
  birth: string;

  @IsBoolean() // 추가: isVerified 값을 위한 decorator
  @ApiProperty({ description: '인증여부' })
  isVerified: boolean; // 추가: isVerified 필드
}
