import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Chat } from './chat.entity';

@Entity()
export class ChatContent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'chat_id' })
  chatId: number;

  @Column({ name: 'sender_id', comment: '보낸유저의 ID' })
  senderId: string;

  @Column({ name: 'sender_type' })
  senderType: string;

  @Column({ name: 'content' })
  content: string;

  @Column({ name: 'is_check' })
  isCheck: boolean;

  @CreateDateColumn({ name: 'create_at', comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'update_at', comment: '수정일' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'delete_at', comment: '삭제일' })
  deletedAt?: Date | null;

  // 다대1 Chat --- ChatContent
  @ManyToOne(() => Chat, (chat) => chat.chatContent)
  chat: Chat;
}
