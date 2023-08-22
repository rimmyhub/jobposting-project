import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAboutmeDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}
