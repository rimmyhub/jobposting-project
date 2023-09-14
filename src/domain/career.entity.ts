// TypeORM 엔티티 정의

import {
  Column,
  Entity,
  PrimaryGeneratedColumn, // 자동으로 증가되는 ID
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Resume } from './resume.entity';
import { Comment } from './comment.entity';
import { ApiProperty } from '@nestjs/swagger';

// Career 클래스는 DB의 'career' 테이블을 의미한다.
@Entity()
export class Career {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'careerId' })
  id: number;

  // @Column을 통해 career의 각 항목의 속성을 정의.
  @Column({ type: 'int', comment: '이력서 ID' })
  @ApiProperty({ description: 'applicantId' })
  resumeId: number; // 이력서 ID 외래키

  @Column({ type: 'varchar', comment: '회사이름' })
  @ApiProperty({ description: '회사이름' })
  companyTitle: string;

  @Column({ type: 'varchar', comment: '직무' })
  @ApiProperty({ description: '직무' })
  job: string;

  @Column({ type: 'varchar', comment: '입사날짜' })
  @ApiProperty({ description: '입사날짜' })
  joiningDate: string;

  @Column({ type: 'varchar', comment: '퇴사날짜' })
  @ApiProperty({ description: '퇴사날짜' })
  resignationDate: string;

  @Column({ type: 'varchar', comment: '직책' })
  @ApiProperty({ description: '직책' })
  position: string;

  @CreateDateColumn({ name: 'create_at', comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'update_at', comment: '수정일' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'delete_at', comment: '삭제일' })
  deletedAt?: Date | null;

  @ManyToOne(() => Resume, (resume) => resume.career, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  resume: Resume;

  @OneToMany(() => Comment, (comment) => comment.career)
  comment: Comment;
}
