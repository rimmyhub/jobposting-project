import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';

// TypeOrmModule과 entity를 가져와서 등록하자
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/domain/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment])],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
