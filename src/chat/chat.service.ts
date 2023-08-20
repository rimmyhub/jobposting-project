import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from 'src/domain/chat.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
  ) {}

  async createUserChat(
    id: number,
    companyId: number,
    createChatDto: CreateChatDto,
  ): Promise<Chat> {
    const { userMessage, companyMessage } = createChatDto;

    const chat = this.chatRepository.create({
      id,
      companyId,
      userMessage,
      companyMessage,
    });
    await this.chatRepository.save(chat);
    return chat;
  }
}
