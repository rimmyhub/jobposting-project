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
    console.log('saveChatContents', payload);
    // this.chatContentRepository.create({
    //   content: payload[0],
    //   chatId: payload[1].roomId,
    //   senderId: payload[1].userId,
    //   senderType: payload[1].userType,
    // });
  }
}
