// verify-code.dto.ts
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class VerifyCodeDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsNotEmpty()
  code: string;
}
