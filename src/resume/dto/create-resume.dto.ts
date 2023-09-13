import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateResumeDto {
  @ApiProperty({ description: '이력서 제목' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: '이력서 내용' })
  @IsString()
  @IsNotEmpty()
  content: string;
}
