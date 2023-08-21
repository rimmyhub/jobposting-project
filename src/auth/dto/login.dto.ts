import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  Min,
  IsNotEmpty,
} from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail({}) // 이메일은 이메일형식으로만 받기
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @Matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{4,25}$/) // <= Matches 안에 정규표현식을 쓸 수 있다.
  password: string;

  @IsString()
  role: string;
}
