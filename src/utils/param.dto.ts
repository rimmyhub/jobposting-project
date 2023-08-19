import { Transform } from 'class-transformer';
import { IsInt } from 'class-validator';

export class ParamDto {
  @Transform((param) => Number(param.value))
  @IsInt()
  id: number;
}
