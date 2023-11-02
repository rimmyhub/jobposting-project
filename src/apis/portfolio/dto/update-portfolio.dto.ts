import { PartialType } from '@nestjs/mapped-types';
import { CreatePortfolioDto } from './create-portfolio.dto';
import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePortfolioDto extends PartialType(CreatePortfolioDto) {
  @IsOptional()
  @ApiProperty({ description: '주소' })
  address?: string;

  @IsOptional()
  @ApiProperty({ description: '파일' })
  file?: string;
}
