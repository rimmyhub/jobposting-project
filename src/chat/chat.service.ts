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
    let result: any;
    try {
      if (type === 'user') {
        result = await this.chatRepository
          .createQueryBuilder('chat')
          .select('chat.id') // 채팅의 아이디
          .leftJoin('chat.chatContent', 'chatContent')
          .addSelect('COUNT(chatContent.isCheck) as isCheckCount')
          .where(`chat.user_id = :user_id`, { user_id: id })
          .andWhere('chatContent.is_check = 0')
          .andWhere(`chatContent.sender_id != :sender_id`, { sender_id: id })
          .groupBy('chat.id')
          .getRawMany();
      } else {
        result = await this.chatRepository
          .createQueryBuilder('chat')
          .select('chat.id') // 채팅의 아이디
          .leftJoin('chat.chatContent', 'chatContent')
          .addSelect('COUNT(chatContent.isCheck) as isCheckCount')
          .where(`chat.company_id = :company_id`, { company_id: id })
          .andWhere('chatContent.is_check = 0')
          .andWhere(`chatContent.sender_id != :sender_id`, { sender_id: id })
          .groupBy('chat.id')
          .getRawMany();
      }
    } catch (error) {
      console.log(error);
    }
    return result;
  }

  // 유저 -> 회사에게 채팅 신청
  // 유효성 검사 필요없나?.. 생각하기
  async createUserChat(id: string, companyId: string): Promise<Chat> {
    const isChatRoom = await this.chatRepository.find({
      where: {
        userId: id,
        companyId: companyId,
      },
    });
    if (isChatRoom.length !== 0) {
      throw new HttpException('이미 대화상대입니다.', HttpStatus.BAD_REQUEST);
    }
    await this.chatRepository.save({
      user: { id }, // 외래키 가져오는 방법
      company: { id: companyId }, // 외래키 가져오는 방법
    });
    const chat = await this.chatRepository
      .createQueryBuilder('chat')
      .select(['chat.id', 'chat.companyId', 'chat.userId', 'company.title'])
      .leftJoin('chat.company', 'company')
      .where(`company.id = :company_id`, { company_id: companyId })
      .getOne();

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
    await this.chatRepository.save({
      company: { id }, // company 가드로 회사 가져오기
      user: { id: userId }, // userid 외래키 찾기
    });
    const chat = await this.chatRepository
      .createQueryBuilder('chat')
      .select(['chat.id', 'chat.companyId', 'chat.userId', 'user.name'])
      .leftJoin('chat.user', 'user')
      .where(`user.id = :user_id`, { user_id: userId })
      .getOne();

    console.log('chat.user_id = ', chat);

    return chat;
  }

  // 회사유저의 채팅리스트 불러오기
  async comGetAllChatRoom(id: string): Promise<Chat[]> {
    const chatRooms = await this.chatRepository
      .createQueryBuilder('chat')
      .select(['chat.id', 'chat.companyId', 'chat.userId', 'user.name'])
      .leftJoin('chat.user', 'user')
      .where(`chat.company_id = :company_id`, { company_id: id })
      .getMany();

    return chatRooms;
  }

  // 일반 유저의 채팅리스트 불러오기
  async userGetAllChatRoom(id: string): Promise<Chat[]> {
    const chatRooms = await this.chatRepository
      .createQueryBuilder('chat')
      .select(['chat.id', 'chat.companyId', 'chat.userId', 'company.title'])
      .leftJoin('chat.company', 'company')
      .where(`chat.user_id = :user_id`, { user_id: id })
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
