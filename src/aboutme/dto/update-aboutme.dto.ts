import { PartialType } from '@nestjs/mapped-types';
import { CreateAboutmeDto } from './create-aboutme.dto';

export class UpdateAboutmeDto extends PartialType(CreateAboutmeDto) {}
