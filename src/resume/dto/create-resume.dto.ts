import { IsNotEmpty, IsString } from 'class-validator';

export class CreateResumeDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
