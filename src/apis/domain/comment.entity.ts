// TypeORM 엔티티 정의

import {
  Column,
  Entity,
  PrimaryGeneratedColumn, // 자동으로 증가되는 ID
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import { Company } from './company.entity';
import { Career } from './career.entity';
import { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';

// Comment 클래스는 DB의 'comment' 테이블을 의미한다.
@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'commentId' })
  id: number;

  // @Column을 통해 comment의 각 항목의 속성을 정의.
  @Column({ type: 'int', comment: '회사 ID' })
  @ApiProperty({ description: '회사 ID' })
  companyId: string; // 회사 ID 외래키

  @Column({ type: 'varchar', comment: '제목' })
  @ApiProperty({ description: '제목' })
  title: string;

  @Column({ type: 'varchar', comment: '내용' })
  @ApiProperty({ description: '내용' })
  comment: string;

  @Column({ type: 'int', comment: '평점' })
  @ApiProperty({ description: '평점' })
  star: number;

  @CreateDateColumn({ name: 'create_at', comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'update_at', comment: '수정일' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'delete_at', comment: '삭제일' })
  deletedAt?: Date | null;

  @ManyToOne(() => Company, (company) => company.comment)
  company: Company;

  @ManyToOne(() => Career, (career) => career.comment)
  career: Career;

  @ManyToOne(() => User, (user) => user.comment)
  user: User;
}
