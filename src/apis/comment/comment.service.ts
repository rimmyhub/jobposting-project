// 비즈니스 로직, DB와 상호작용을 담당.

import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from '../domain/comment.entity';

// CommentService 클래스는 실제 비즈니스 로직을 처리함과 동시에
// DB와의 상호작용을 담당한다.
// @Injectable을 사용하여 'Comment' 엔티티에 대한 레포지토리를 주입받는다.
@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  // createComment 함수는 새로운 리뷰에 대한 정보를 생성, 저장한다.
  async createComment(companyId: string, createCommentDto: CreateCommentDto) {
    const { title, comment, star } = createCommentDto;

    const newComment = await this.commentRepository.save({
      companyId,
      title,
      comment,
      star,
    });
    return newComment;
  }

  // findAllComment 함수는 모든 리뷰 정보를 조회한다.
  async findAllComment(companyId: string): Promise<Comment[]> {
    return this.commentRepository.find({ where: { companyId } });
  }

  // findOneComment 함수는 특정 리뷰 정보를 조회한다.
  async findOneComment(companyId: string, commentId: number) {
    const comment = await this.commentRepository.findOne({
      where: { companyId, id: commentId }, // companyId와 commentId를 조건으로 추가
    });
    if (!comment) {
      throw new HttpException(
        '해당 리뷰를 찾을 수 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
    return comment;
  }

  // updateComment 함수는 특정 ID에 해당하는 리뷰 정보를 업데이트한다.
  async updateComment(id: number, updateCommentDto: UpdateCommentDto) {
    const comment = await this.commentRepository.findOne({ where: { id } });
    if (!comment) {
      throw new HttpException(
        '해당 리뷰를 찾을 수 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
    Object.assign(comment, updateCommentDto);
    await this.commentRepository.save(comment);

    return `해당 리뷰가 수정되었습니다.`;
  }

  // removeComment 함수는 특정 ID에 해당하는 리뷰 정보를 삭제한다.
  async removeComment(id: number) {
    const comment = await this.commentRepository.findOne({ where: { id } });
    if (!comment) {
      throw new HttpException(
        '리뷰를 찾을 수 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.commentRepository.remove(comment);
  }
}
