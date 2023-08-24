import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  IsNotEmpty,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail({}) // 이메일은 이메일형식으로만 받기
  email: string;

  image: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @Matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{4,25}$/) // <= Matches 안에 정규표현식을 쓸 수 있다.
  password: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  @MinLength(2)
  name: string;

  @IsNotEmpty()
  @Matches(/^\d{3}-\d{3,4}-\d{4}$/)
  phone: string;

  @IsNotEmpty()
  @MaxLength(1)
  gender: string;

  @IsNotEmpty()
  address: string;

  // 생년월일 정규표현식 예) 1999-05-05
  // @Matches(/^\d{4}\d{2}\d{2}$/)
  @IsNotEmpty()
  @Matches(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)
  birth: string;
}
