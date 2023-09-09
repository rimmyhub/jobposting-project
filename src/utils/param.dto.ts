import { Transform } from 'class-transformer';
import { IsInt } from 'class-validator';

// transform으로 id를 Number값으로 변환해줌
export class ParamDto {
  @Transform((param) => Number(param.value))
  @IsInt()
  id: string;
}
