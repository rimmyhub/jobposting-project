import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatContent } from 'src/domain/chatContent.entity';

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
      select: ['senderId', 'senderType', 'content', 'createdAt'],
      where: { chatId: id },
      order: { createdAt: 'ASC' },
    });
    return result;
  }
}
