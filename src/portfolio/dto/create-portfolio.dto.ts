import { IsString } from 'class-validator';

export class CreatePortfolioDto {
  @IsString()
  address: string;

  @IsString()
  file: string;
}
