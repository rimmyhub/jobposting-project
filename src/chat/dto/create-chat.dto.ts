import { IsNotEmpty, IsString } from 'class-validator';

export class CreateChatDto {
  @IsNotEmpty()
  @IsString()
  companyId: string;

  @IsNotEmpty()
  @IsString()
  userMessage: string;

  @IsNotEmpty()
  @IsString()
  companyMessage: string;
}
