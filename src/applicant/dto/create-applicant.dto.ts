import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateApplicantDto {
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  jobpostingId: number;
}
