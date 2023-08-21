import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { Comment } from 'src/domain/comment.entity';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ParamDto } from 'src/utils/param.dto';

// CommentController 클래스는 각 API의 엔드포인트를 정의한다.
// 즉, 경로를 설정한다고 보면 됨
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  // 리뷰 등록
  @Post(':companyId')
  createComment(@Body() createCommentDto: CreateCommentDto): Promise<Comment> {
    const comment = this.commentService.createComment(createCommentDto);
    return comment;
  }

  // 리뷰 전체 조회
  @Get(':companyId')
  findAllComment() {
    return this.commentService.findAllComment();
  }

  // 리뷰 상세 조회
  @Get(':companyId/:commentId')
  findOneComment(@Param() { id }: ParamDto) {
    return this.commentService.findOneComment(id);
  }

  // 리뷰 수정
  @Patch(':commentId')
  updateComment(
    @Param(':commentId') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentService.updateComment(+id, updateCommentDto);
  }

  // 리뷰 삭제
  @Delete(':commentId')
  removeComment(@Param(':commentId') id: string) {
    return this.commentService.removeComment(+id);
  }
}
