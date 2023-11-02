import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyCodeDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '이메일' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '인증번호' })
  code: string;
}
