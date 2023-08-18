// PartialType을 사용하여 CreateCareerDto 클래스를 상속.
// PartialType을 사용하면 CreateCareerDto의 필드 중에서 일부만 업데이트할 수 있다.
// CreateCareerDto의 필드에 변경이 있을 때 자동으로 UpdateCareerDto에도 반영된다.

import { PartialType } from '@nestjs/mapped-types';
import { CreateCareerDto } from './create-career.dto';

export class UpdateCareerDto extends PartialType(CreateCareerDto) {}
