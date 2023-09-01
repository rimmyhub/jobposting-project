import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Jobposting } from './jobposting.entity';
import { Comment } from './comment.entity';
import { Chat } from './chat.entity';

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', comment: '이메일' })
  email: string;

  @Column({ type: 'varchar', comment: '패스워드' })
  password: string;

  @Column({ type: 'text', comment: '회사 이미지' })
  image: string;

  @Column({ type: 'varchar', comment: '회사명' })
  title: string;

  @Column({ type: 'varchar', comment: '소개' })
  introduction: string;

  @Column({ type: 'varchar', comment: '웹사이트' })
  website: string;

  @Column({ type: 'varchar', comment: '본사 주소' })
  address: string;

  @Column({ type: 'varchar', comment: '업계' })
  business: string;

  @Column({ type: 'varchar', comment: '직원수' })
  employees: string;

  @CreateDateColumn({ name: 'create_at', comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'update_at', comment: '수정일' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'delete_at', comment: '삭제일' })
  deletedAt?: Date | null;

  // refreshToken저장하기
  @Column({ nullable: true })
  currentRefreshToken: string;

  @Column({ type: 'datetime', nullable: true })
  currentRefreshTokenExp: Date;

  // @DeleteDateColumn({ name: 'delete_at', comment: '삭제일' })
  // deletedAt?: Date | null;

  //1:N 관계 설정
  @OneToMany(() => Jobposting, (jobposting) => jobposting.company)
  @JoinColumn()
  jobposting: Jobposting[];

  // 1:N관계 설정
  @OneToMany(() => Comment, (comment) => comment.company)
  comment: Comment;

  //1:N 관계 설정 - 채팅
  @OneToMany(() => Chat, (chat) => chat.company)
  chat: Chat[];
}
