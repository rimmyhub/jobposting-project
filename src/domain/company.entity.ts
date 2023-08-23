import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { Jobposting } from './jobposting.entity';
import { Comment } from './comment.entity';
import { Chat } from './chat.entity';

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, comment: '이메일' })
  email: string;

  @Column({ type: 'varchar', length: 150, comment: '패스워드' })
  password: string;

  @Column({ type: 'varchar', length: 30, comment: '회사명' })
  title: string;

  @Column({ type: 'varchar', length: 255, comment: '소개' })
  introduction: string;

  @Column({ type: 'varchar', length: 255, comment: '웹사이트' })
  website: string;

  @Column({ type: 'varchar', length: 255, comment: '본사 주소' })
  address: string;

  @Column({ type: 'varchar', length: 255, comment: '업계' })
  business: string;

  @Column({ type: 'int', comment: '직원수' })
  employees: number;

  @CreateDateColumn({ name: 'create_at', comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'update_at', comment: '수정일' })
  updatedAt: Date;

  @Column({ default: false })
  deleted: boolean;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  // refreshToken저장하기
  @Column({ nullable: true })
  currentRefreshToken: string;

  @Column({ type: 'datetime', nullable: true })
  currentRefreshTokenExp: Date;

  // @DeleteDateColumn({ name: 'delete_at', comment: '삭제일' })
  // deletedAt?: Date | null;

  //1:N 관계 설정
  @OneToMany(() => Jobposting, (jobposting) => jobposting.company)
  jobposting: Jobposting[];

  // 1:N관계 설정
  @OneToMany(() => Comment, (comment) => comment.company)
  comment: Comment;

  //1:N 관계 설정 - 채팅
  @OneToMany(() => Chat, (chat) => chat.company)
  chat: Chat[];
}
