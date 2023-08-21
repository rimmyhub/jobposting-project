import { IsNotEmpty, IsString } from 'class-validator';
import { educationType } from 'commons/education.enums';

export class CreateEducationDto {
  @IsString()
  @IsNotEmpty()
  schoolTitle: string;

  @IsString()
  @IsNotEmpty()
  admissionYear: string;

  @IsString()
  @IsNotEmpty()
  graduationYear: string;

  @IsString()
  @IsNotEmpty()
  major: string;

  @IsString()
  @IsNotEmpty()
  education: educationType;
}
