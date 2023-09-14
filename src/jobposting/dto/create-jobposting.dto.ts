import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateJobpostingDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '제목' })
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '경력' })
  career: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '연봉' })
  salary: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '학력' })
  education: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '분야' })
  job: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '경력' })
  workType: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '지역' })
  workArea: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10) //최솟값
  @ApiProperty({ description: '내용' })
  content: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '마감일' })
  dueDate: string;
}
