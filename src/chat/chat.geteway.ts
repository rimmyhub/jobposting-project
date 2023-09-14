import { Inject } from '@nestjs/common';
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

// 소켓IO
@WebSocketGateway(8080, {
  cors: {
    origin: [
      'http://localhost:3000',
      'http://w1nner.site/',
      'https://w1nner.site/',
    ],
  },
})
export class ChatGateway {
  @WebSocketServer() io: Namespace;

  constructor(
    private readonly chatContentService: ChatContentService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  // 상대방에게 면접을 신청interview-call
  @SubscribeMessage('interview-call')
  async createRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: object,
  ) {
    const getSocketId: string = await this.cacheManager.store.get(
      `${payload['reciId']}`,
    );
    socket.to(getSocketId).emit('inteview-received', payload);
  }

  // 상대가 화상면접에 응했을 때 socket room을 join한다.
  @SubscribeMessage('interview-join')
  interviewJoin(
    @ConnectedSocket() socket: Socket,
    @MessageBody() roomId: string,
  ): void {
    socket.join(roomId);
    socket.to(roomId).emit('welcome', roomId);
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
    socket.to(payload['roomId']).emit('ice-received', payload);
  }

  /////////////////////////////////////////////////
  // 로그인을 했을 때 redis에 유저의 id와 socket의 id를 저장한다.
  @SubscribeMessage('saveClientId')
  async loginClientId(
    @ConnectedSocket() socket: Socket,
    @MessageBody() userId: string,
  ) {
    await this.cacheManager.store.set(`${userId}`, socket.id, 100000);

    await this.cacheManager.store.keys();
    // 키의 이름에 userId를 넣어준다.
  }

  // 실시간으로 메세지수신을 알려주는 socket
  @SubscribeMessage('msg-notification')
  async msgNotification(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: Array<any>,
  ) {
    // 메세지수신알림을 보낼 유저id와 socketId를 가져온다
    // 알림을 보내고자하는 payload가 포함된 키값의 socketId를 가져온다.
    const getsocketId: string = await this.cacheManager.store.get(
      `${payload[0]}`,
    );
    if (getsocketId) {
      this.io.to(getsocketId).emit('msg-notification', payload[1]);
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
