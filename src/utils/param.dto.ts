import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';

// transform으로 id를 Number값으로 변환해줌
export class ParamDto {
  @Transform((param) => param.value)
  @IsString()
  id: string;
}
