import { PartialType } from '@nestjs/swagger';
import { CreateJobcrawlerDto } from './create-jobcrawler.dto';

export class UpdateJobcrawlerDto extends PartialType(CreateJobcrawlerDto) {}
