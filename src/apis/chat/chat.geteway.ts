import { Inject, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Namespace } from 'socket.io';
import { ChatContentService } from 'src/chat-content/chat-content.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Company } from '../domain/company.entity';
import { User } from 'src/domain/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

// 소켓IO
@WebSocketGateway({
  cors: {
    origin: '*',
    // origin: [
    //   'http://localhost:3000',
    //   'http://w1nner.site/',
    //   'https://w1nner.site/',
    // ],
  },
})
export class ChatGateway {
  @WebSocketServer() io: Namespace;

  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly chatContentService: ChatContentService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  // 상대방에게 면접을 신청interview-call
  // @UseGuards(CompanyGuard)
  @SubscribeMessage('interview-call')
  async interviewCall(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: Array<any>,
  ) {
    try {
      const userInfo: string = await this.cacheManager.store.get(
        `${payload[1]}`,
      );
      console.log('userInfo = ', userInfo);
      if (userInfo === undefined) {
        const errMessage = {
          errorMsg: '상대방이 로그인을 하지 않았습니다.',
          status: false,
        };
        socket.emit('interview-received', errMessage);
        socket.leave(payload[0]);
        throw new HttpException(
          '상대방이 로그인을 하지 않았습니다.',
          HttpStatus.BAD_REQUEST,
        );
      } else {
        const returnPayload = {
          roomId: payload[0],
          reciId: payload[1],
          reciSocketId: userInfo['socketId'],
        };
        socket.emit('interview-received', returnPayload);
      }
    } catch (error) {
      console.log('error', error);
    }
  }
  // 상대에게 면접신청하기
  @SubscribeMessage('apply-interview')
  async applyInterview(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: object,
  ) {
    const title = await this.companyRepository.find({
      select: ['title'],
      where: { id: payload['id'] },
    });
    payload['title'] = title[0].title;
    socket.to(payload['reciSocketId']).emit('apply-interview', payload);
  }
  // 상대방이 면접신청에 대해 거절을 했을 경우
  @SubscribeMessage('refuse-interview')
  async refuseInterview(
    @ConnectedSocket() socket: Socket,
    @MessageBody() companyId: string,
  ) {
    const userInfo: string = await this.cacheManager.store.get(`${companyId}`);
    console.log('userInfo = ', userInfo);
    socket.to(userInfo['socketId']).emit('refuse-interview');
  }

  // 상대가 화상면접에 응했을 때 socket room을 join한다.
  @SubscribeMessage('interview-join')
  interviewJoin(
    @ConnectedSocket() socket: Socket,
    @MessageBody() roomId: string,
  ): void {
    console.log(':roomId = ', roomId);
    socket.join(roomId);
    socket.to(roomId).emit('welcome', roomId);
  }

  // 면접을 신청한 유저가 화면을 꺼버렸을 때 면접 신청을 받은 유저측의 알림 끄기
  @SubscribeMessage('close-notification-interview')
  async closeNotification(
    @ConnectedSocket() socket: Socket,
    @MessageBody() userId: string,
  ): Promise<void> {
    const userInfo = await this.cacheManager.store.get(`${userId}`);
    if (userInfo) {
      socket.to(userInfo['socketId']).emit('close-notification-interview');
    }
  }

  // 내가 상대방에게 offer를 보낸다.
  @SubscribeMessage('send-offer')
  sendOffer(@ConnectedSocket() socket: Socket, @MessageBody() payload: object) {
    socket.to(payload['roomId']).emit('offer-received', payload);
  }

  // 상대방이 보낸 answer를 받는다.
  @SubscribeMessage('send-answer')
  sendAnswer(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: object,
  ) {
    socket.to(payload['roomId']).emit('answer-received', payload);
  }

  // icecandidate를 받음
  @SubscribeMessage('send-ice')
  sendIceCandidate(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: object,
  ) {
    socket.to(payload[1]).emit('ice-received', payload);
  }

  /////////////////////////////////////////////////
  // 로그인을 했을 때 redis에 유저의 id와 socket의 id를 저장한다.
  @SubscribeMessage('saveClientId')
  async loginClientId(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: object,
  ) {
    let getName: Array<object>;
    // 로그인을 했을 때 닉넴임과 userId, socketId를 저장할까?
    // 회사인지 유저인지 구별하기
    if (payload['type'] === 'user') {
      getName = await this.userRepository.find({
        select: ['name'],
        where: { id: payload['userId'] },
      });
    } else {
      getName = await this.companyRepository.find({
        select: ['title'],
        where: { id: payload['userId'] },
      });
    }
    console.log('getName = ', getName);
    const userInfo = {
      name: getName[0]['name'],
      socketId: socket.id,
    };
    await this.cacheManager.store.set(`${payload['userId']}`, userInfo, 100000);
    // reflesh 토큰시간에 맞춰서 로그아웃이 될때까지 사용
  }

  // 실시간으로 메세지수신을 알려주는 socket
  @SubscribeMessage('msg-notification')
  async msgNotification(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: Array<any>,
  ) {
    // 메세지수신알림을 보낼 유저id와 socketId를 가져온다
    // 알림을 보내고자하는 payload가 포함된 키값의 socketId를 가져온다.
    const userInfo: string = await this.cacheManager.store.get(`${payload[0]}`);
    if (userInfo) {
      socket.to(userInfo['socketId']).emit('msg-notification');
    }
  }

  // chat ID로 join하기
  @SubscribeMessage('join')
  joinChatRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() roomId: string,
  ): void {
    socket.join(roomId);
  }

  // 메세지 보내기
  @SubscribeMessage('message')
  async sendMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: Array<any>,
  ) {
    // 채팅내용"을 저장"하기
    await this.chatContentService.saveChatContents(payload);
    // 룸에 있는 유저에게만 메세지 보내기
    this.io
      .to(payload[1].roomId)
      .emit(
        'receive-message',
        payload[0],
        payload[1].userId,
        payload[1].userType,
      );
  }

  // 방나가기
  @SubscribeMessage('leave')
  leaveRoom(@ConnectedSocket() socket: Socket, @MessageBody() roomId: string) {
    // 이미 접속한 방인지 확인
    if (socket.rooms) {
      socket.leave(roomId);
    }
  }
}
