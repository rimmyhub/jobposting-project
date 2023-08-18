// 데이터 전송 객체
// 데이터 유효성 검증을 위한 DTO 클래스들.
// 데이터 유효성이란?
// 입력된 데이터가 정확한지, 필요한 규칙을 따르는 지를 확인하는 프로세스
// 시스템 또는 어플리케이션의 예상된 형태와 일치하는지 확인한다.
// 데이터의 무결성과 안전성을 보장해줄 수 있다!

import { IsNotEmpty, IsDateString, IsString } from 'class-validator';

export class CreateCareerDto {
  @IsNotEmpty()
  @IsString()
  companyTitle: string;

  @IsNotEmpty()
  @IsString()
  job: string;

  @IsNotEmpty()
  @IsDateString()
  joiningDate: string;

  @IsNotEmpty()
  @IsDateString()
  resignationDate: string;

  @IsNotEmpty()
  @IsString()
  position: string;
}
