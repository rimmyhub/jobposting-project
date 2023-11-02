import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateRoomDto } from './create-room.dto';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateChatDto extends PartialType(CreateRoomDto) {
  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'companyId', required: false })
  companyId?: string;
}
