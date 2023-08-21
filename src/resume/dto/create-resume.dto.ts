import { IsString } from 'class-validator';

export class CreateResumeDto {
  @IsString()
  title: string;

  @IsString()
  content: string;
}
