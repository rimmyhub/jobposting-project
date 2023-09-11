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
    origin: 'http://localhost:3000',
  },
})
export class ChatGateway {
  @WebSocketServer() io: Namespace;

  constructor(
    private readonly chatContentService: ChatContentService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @SubscribeMessage('createRoom')
  createRoom() {}

  // 로그인을 했을 때 redis에 유저의 id와 socket의 id를 저장한다.
  @SubscribeMessage('saveClientId')
  async loginClientId(
    @ConnectedSocket() socket: Socket,
    @MessageBody() userId: string,
  ) {
    await this.cacheManager.store.set(`${userId}`, socket.id, 100000);

    const result = await this.cacheManager.store.keys();
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
    console.log(payload);
    const getsocketId: string = await this.cacheManager.store.get(
      `${payload[0]}`,
    );
    if (getsocketId) {
      this.io.to(getsocketId).emit('msg-notification', payload[1]);
    }
  }

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
