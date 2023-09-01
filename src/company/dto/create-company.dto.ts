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
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5) //최솟값
  @Matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{4,25}$/)
  password: string;

  @IsString()
  image: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  introduction: string;

  @IsNotEmpty()
  @IsString()
  website: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  business: string;

  @IsNotEmpty()
  @IsString()
  employees: string;

  @IsBoolean() // 추가: isVerified 값을 위한 decorator
  isVerified: boolean; // 추가: isVerified 필드
}
