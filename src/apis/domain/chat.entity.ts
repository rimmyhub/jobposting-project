import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Company } from './company.entity';
import { ChatContent } from './chatContent.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'chatId' })
  id: number;

  @Column({ name: 'user_id' })
  @ApiProperty({ description: 'userId' })
  userId: string;

  @Column({ name: 'company_id' })
  @ApiProperty({ description: 'companyId' })
  companyId: string;

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

  // 1대1 Chat --- ChatContent
  @OneToMany(() => ChatContent, (chatContent) => chatContent.chat)
  chatContent: ChatContent[];
}
