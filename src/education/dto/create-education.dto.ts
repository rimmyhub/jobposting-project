import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { educationType } from 'commons/education.enums';

export class CreateEducationDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '학교이름' })
  schoolTitle: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '입학년도' })
  admissionYear: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '졸업년도' })
  graduationYear: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '전공' })
  major: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '학력구분' })
  education: educationType;
}
