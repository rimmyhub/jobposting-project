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
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class ChatContent {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'chatContentId' })
  id: number;

  @Column({ name: 'chat_id' })
  @ApiProperty({ description: 'chatId' })
  chatId: number;

  @Column({ name: 'sender_id', comment: '보낸유저의 ID' })
  @ApiProperty({ description: 'senderId' })
  senderId: string;

  @Column({ name: 'sender_type' })
  @ApiProperty({ description: 'senderType' })
  senderType: string;

  @Column({ name: 'content' })
  @ApiProperty({ description: '내용' })
  content: string;

  @Column({ name: 'is_check' })
  @ApiProperty({ description: '확인여부' })
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
