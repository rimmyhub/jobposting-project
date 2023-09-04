import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Namespace } from 'socket.io';
import { ChatService } from './chat.service';
import { ChatContentService } from 'src/chat-content/chat-content.service';

// 소켓IO
@WebSocketGateway(8080, {
  cors: {
    origin: 'http://localhost:3000',
  },
})
export class ChatGateway {
  @WebSocketServer() io: Namespace;

  constructor(
    private readonly chatService: ChatService,
    private readonly chatContentService: ChatContentService,
  ) {}

  @SubscribeMessage('createRoom')
  createRoom() {}

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
    // 채팅내용을 저장하기
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
