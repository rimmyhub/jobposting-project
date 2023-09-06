import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyCodeDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  code: string;
}
