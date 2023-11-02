import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentDto } from './create-comment.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {
  @IsOptional()
  @IsString()
  @ApiProperty({ description: '댓글 제목', required: false })
  title?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '댓글 내용', required: false })
  comment?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ description: '평점', required: false })
  star?: number;
}
