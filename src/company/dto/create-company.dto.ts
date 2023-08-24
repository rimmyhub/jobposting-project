import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MinLength,
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
  @IsNumber()
  employees: number;
}
