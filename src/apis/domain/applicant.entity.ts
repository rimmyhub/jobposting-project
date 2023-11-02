import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Jobposting } from './jobposting.entity';
import { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Applicant {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'applicantId' })
  id: number;

  @Column({ name: 'user_id' })
  @ApiProperty({ description: 'userId' })
  userId: string;

  @Column({ name: 'jobposting_id' })
  @ApiProperty({ description: 'jobpostingId' })
  jobpostingId: number;

  @CreateDateColumn({ name: 'create_at', comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'update_at', comment: '수정일' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'delete_at', comment: '삭제일' })
  deletedAt?: Date | null;

  // 1:N 관계 설정
  @ManyToOne(() => Jobposting, (jobposting) => jobposting.applicant, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  jobposting: Jobposting;

  @ManyToOne(() => User, (user) => user.applicant)
  user: User;
}
