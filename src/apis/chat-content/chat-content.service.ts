import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatContent } from '../domain/chatContent.entity';

@Injectable()
export class ChatContentService {
  constructor(
    @InjectRepository(ChatContent)
    private readonly chatContentRepository: Repository<ChatContent>,
  ) {}

  // 채팅내용 저장하기
  async saveChatContents(payload: Array<any>) {
    this.chatContentRepository.save({
      content: payload[0],
      chatId: payload[1].roomId,
      senderId: payload[1].userId,
      senderType: payload[1].userType,
    });
  }

  // 채팅내용 불러오기
  async getChatContents(id: number) {
    const result = await this.chatContentRepository.find({
      select: ['senderId', 'senderType', 'content', 'isCheck', 'createdAt'],
      where: { chatId: id },
      order: { createdAt: 'ASC' },
    });
    return result;
  }

  // 채팅내용 읽음 처리
  async readChatContents(chat_id: number, sender_id: number) {
    await this.chatContentRepository
      .createQueryBuilder()
      .update(ChatContent)
      .set({ isCheck: true })
      .where('chat_id = :chat_id', { chat_id }) // 쿼리빌더의 where에는 컬럼명과 변수명을 다 똑같이 해줘야한다..
      .andWhere(' sender_id != :sender_id', { sender_id })
      .execute();
  }
}
