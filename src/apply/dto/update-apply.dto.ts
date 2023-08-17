import { PartialType } from '@nestjs/mapped-types';
import { CreateApplyDto } from './create-apply.dto';

export class UpdateApplyDto extends PartialType(CreateApplyDto) {}
