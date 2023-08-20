import { IsNotEmpty, IsString } from 'class-validator';

export class CreateChatDto {
  @IsNotEmpty()
  @IsString()
  userMessage: string | null;

  @IsNotEmpty()
  @IsString()
  companyMessage: string | null;
}
