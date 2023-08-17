import { PartialType } from '@nestjs/mapped-types';
import { CreateJobpostingDto } from './create-jobposting.dto';

export class UpdateJobpostingDto extends PartialType(CreateJobpostingDto) {}
