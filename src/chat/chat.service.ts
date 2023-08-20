import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from 'src/domain/chat.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
  ) {}

  // 유저 -> 회사에게 채팅 신청
  // 유효성 검사 필요없나?.. 생각하기
  async createUserChat(
    id: number,
    companyId: number,
    createChatDto: CreateChatDto,
  ): Promise<Chat> {
    const { userMessage, companyMessage } = createChatDto;

    const chat = await this.chatRepository.save({
      user: { id }, // 외래키 가져오는 방법
      company: { id: companyId }, // 외래키 가져오는 방법
      userMessage,
      companyMessage,
    });
    return chat;
  }

  // 회사 -> 유저에게 채팅신청
  async createCompanyChat(
    id: number,
    userId: number,
    createChatDto: CreateChatDto,
  ): Promise<Chat> {
    const { userMessage, companyMessage } = createChatDto;

    const chat = await this.chatRepository.save({
      company: { id }, // company 가드로 회사 가져오기
      user: { id: userId }, // userid 외래키 찾기
      userMessage,
      companyMessage,
    });
    return chat;
  }

  // 유저가 -> 회사 채팅 삭제
  async removeUserChat(id: number, chatId: number) {
    const chat = await this.chatRepository.findOne({
      where: { id: chatId },
    });

    if (!chat) {
      throw new HttpException(
        '대화 내역을 찾을 수 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // 챗의 유저 아이디와 로그인한 유저아이디가 같지 않으면 권한 없음
    if (chat.userId !== id) {
      throw new HttpException('권한이 없습니다.', HttpStatus.FORBIDDEN);
    }

    return await this.chatRepository.remove(chat);
  }

  // 회사가 -> 유저 채팅 삭제
  async removeCompanyChat(id: number, chatId: number) {
    const chat = await this.chatRepository.findOne({
      where: { id: chatId },
    });

    if (!chat) {
      throw new HttpException(
        '대화 내역을 찾을 수 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // 챗의 회사 아이디와 로그인한 회사아이디가 같지 않으면 권한 없음
    if (chat.companyId !== id) {
      throw new HttpException('권한이 없습니다.', HttpStatus.FORBIDDEN);
    }

    return await this.chatRepository.remove(chat);
  }
}
