import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from 'src/domain/chat.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
  ) {}

  // 해당유저가 받은 메세지 중에 isCkeck가 false인 chat-content가 있는지 확인하는 class
  async checkChat(id: string, type: string): Promise<any> {
    console.log('checkChat', id, type);
    let result: any;
    if (type === 'user') {
      result = await this.chatRepository
        .createQueryBuilder('chat')
        .select('chat.id') // 채팅의 아이디
        .leftJoin('chat.chatContent', 'chatContent')
        .addSelect('COUNT(chatContent.isCheck) as isCheckCount')
        .where(`chat.user_id = ${id}`)
        .andWhere('chatContent.is_check = 0')
        .andWhere(`chatContent.sender_id != ${id}`)
        .groupBy('chat.id')
        .getRawMany();
    } else {
      result = await this.chatRepository
        .createQueryBuilder('chat')
        .select('chat.id') // 채팅의 아이디
        .leftJoin('chat.chatContent', 'chatContent')
        .addSelect('COUNT(chatContent.isCheck) as isCheckCount')
        .where(`chat.company_id = ${id}`)
        .andWhere('chatContent.is_check = 0')
        .andWhere(`chatContent.sender_id != ${id}`)
        .groupBy('chat.id')
        .getRawMany();
    }

    return result;
  }

  // 유저 -> 회사에게 채팅 신청
  // 유효성 검사 필요없나?.. 생각하기
  async createUserChat(id: string, companyId: string): Promise<Chat> {
    const chat = await this.chatRepository.save({
      user: { id }, // 외래키 가져오는 방법
      company: { id: companyId }, // 외래키 가져오는 방법
    });
    return chat;
  }

  // 회사 -> 유저에게 채팅신청
  async createCompanyChat(id: string, userId: string): Promise<Chat> {
    const isChatRoom = await this.chatRepository.find({
      where: {
        userId: userId,
        companyId: id,
      },
    });
    if (isChatRoom.length !== 0) {
      throw new HttpException('이미 대화상대입니다.', HttpStatus.BAD_REQUEST);
    }
    const chat = await this.chatRepository.save({
      company: { id: id }, // company 가드로 회사 가져오기
      user: { id: userId }, // userid 외래키 찾기
    });
    console.log('chat = ', chat);
    return chat;
  }

  // 회사유저의 채팅리스트 불러오기
  async comGetAllChatRoom(id: number): Promise<Chat[]> {
    const chatRooms = await this.chatRepository
      .createQueryBuilder('chat')
      .select(['chat.id', 'chat.companyId', 'chat.userId', 'user.email'])
      .leftJoin('chat.user', 'user')
      .where(`chat.companyId = ${id}`)
      .getMany();

    return chatRooms;
  }

  // 일반 유저의 채팅리스트 불러오기
  async userGetAllChatRoom(id: number): Promise<Chat[]> {
    const chatRooms = await this.chatRepository
      .createQueryBuilder('chat')
      .select(['chat.id', 'chat.companyId', 'chat.userId', 'company.email'])
      .leftJoin('chat.company', 'company')
      .where(`chat.userId = ${id}`)
      .getMany();
    return chatRooms;
  }

  // 유저가 -> 회사 채팅 삭제
  async removeUserChat(id: string, chatId: number) {
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
  async removeCompanyChat(id: string, chatId: number) {
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
