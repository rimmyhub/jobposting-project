import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAboutmeDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '자소서 제목' })
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '자소서 제목' })
  content: string;
}
