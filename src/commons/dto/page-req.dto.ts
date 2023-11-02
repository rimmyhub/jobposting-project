import { Transform } from 'class-transformer';
import { IsInt } from 'class-validator';

export class PageReqDto {
  @Transform((param) => Number(param.value))
  @IsInt()
  page?: number = 1;

  @Transform((param) => Number(param.value))
  @IsInt()
  size?: number = 20;
}
