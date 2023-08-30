import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateJobpostingDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  career: string;

  @IsNotEmpty()
  @IsString()
  salary: string;

  @IsNotEmpty()
  @IsString()
  education: string;

  @IsNotEmpty()
  @IsString()
  workType: string;

  @IsNotEmpty()
  @IsString()
  workArea: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10) //최솟값
  content: string;

  @IsNotEmpty()
  @IsString()
  dueDate: string;
}
