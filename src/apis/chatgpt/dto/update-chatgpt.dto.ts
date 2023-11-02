import { PartialType } from '@nestjs/swagger';
import { CreateChatgptDto } from './create-chatgpt.dto';

export class UpdateChatgptDto extends PartialType(CreateChatgptDto) {}
