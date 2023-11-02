import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePortfolioDto {
  @IsString()
  @ApiProperty({ description: '주소' })
  address: string;

  @IsString()
  @ApiProperty({ description: '파일' })
  file: string;
}
