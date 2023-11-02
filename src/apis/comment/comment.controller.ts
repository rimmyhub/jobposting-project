import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Comment } from '../domain/comment.entity';

// CommentController 클래스는 각 API의 엔드포인트를 정의한다.
// 즉, 경로를 설정한다고 보면 됨
@Controller('comments')
@ApiTags('댓글 API')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  // 리뷰 등록
  // @UseGuards(UserGuard)
  @Post(':companyId')
  @ApiOperation({ summary: '리뷰 등록 API', description: '리뷰 등록' })
  @ApiCreatedResponse({ description: '리뷰 등록', type: Comment })
  createComment(
    @Body() createCommentDto: CreateCommentDto,
    @Param('companyId') companyId: string,
  ) {
    const comment = this.commentService.createComment(
      companyId,
      createCommentDto,
    );
    return comment;
  }

  // 리뷰 전체 조회
  @Get(':companyId')
  @ApiOperation({ summary: '리뷰 전체조회 API', description: '리뷰 전체조회' })
  @ApiCreatedResponse({ description: '리뷰 전체조회', type: Comment })
  findAllComment(@Param('companyId') companyId: string) {
    return this.commentService.findAllComment(companyId);
  }

  // 리뷰 상세 조회
  @Get(':companyId/:commentId')
  @ApiOperation({ summary: '리뷰 상세조회 API', description: '리뷰 상세조회' })
  @ApiCreatedResponse({ description: '리뷰 상세조회', type: Comment })
  findOneComment(
    @Param('companyId') companyId: string, // companyId 파라미터 추가
    @Param('commentId') commentId: number, // commentId 파라미터 추가
  ) {
    return this.commentService.findOneComment(companyId, commentId); // 수정된 파라미터 전달
  }

  // 리뷰 수정
  // @UseGuards(UserGuard)
  @Patch(':companyId/:commentId')
  @ApiOperation({ summary: '리뷰 수정 API', description: '리뷰 수정' })
  @ApiCreatedResponse({ description: '리뷰 수정', type: Comment })
  updateComment(
    @Param('commentId') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentService.updateComment(+id, updateCommentDto);
  }

  // 리뷰 삭제
  // @UseGuards(UserGuard)
  @Delete(':companyId/:commentId')
  @ApiOperation({ summary: '리뷰 삭제 API', description: '리뷰 삭제' })
  @ApiCreatedResponse({ description: '리뷰 삭제', type: Comment })
  removeComment(@Param('commentId') id: string) {
    return this.commentService.removeComment(+id);
  }
}
