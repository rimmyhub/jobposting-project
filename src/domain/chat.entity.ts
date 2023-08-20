import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Company } from './company.entity';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'company_id' })
  companyId: number;

  @Column({ type: 'text', comment: '유저 메세지' }) //longtext
  userMessage: string;

  @Column({ type: 'text', comment: '회사 메세지' }) //longtext
  companyMessage: string;

  @CreateDateColumn({ name: 'create_at', comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'update_at', comment: '수정일' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'delete_at', comment: '삭제일' })
  deletedAt?: Date | null;

  // 유저 연결
  @ManyToOne(() => User, (user) => user.chat)
  user: User;

  // 회사 연결
  @ManyToOne(() => Company, (company) => company.chat)
  company: Company;
}
