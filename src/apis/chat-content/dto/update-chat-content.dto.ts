import { PartialType } from '@nestjs/swagger';
import { CreateChatContentDto } from './create-chat-content.dto';

export class UpdateChatContentDto extends PartialType(CreateChatContentDto) {}
