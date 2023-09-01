import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket, Namespace } from 'socket.io';
// 소켓IO
@WebSocketGateway(8080, {
  cors: {
    origin: 'http://localhost:3000',
  },
})
export class ChatGateway {
  // @WebSocketServer()
  // server: Server;
  @WebSocketServer() io: Namespace;

  constructor() {}

  @SubscribeMessage('createRoom')
  createRoom() {}

  @SubscribeMessage('join')
  joinChatRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() roomId: string,
  ): void {
    // 이미 접속한 방인지 확인
    console.log('socket.rooms', socket.id);
    socket.join(roomId);
  }

  @SubscribeMessage('message')
  sendMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: string,
    @MessageBody() roomId: string,
  ) {
    console.log('socket roomId = ', roomId[1]);
    // console.log('socket.rooms', socket.rooms);

    // 룸에 있는 유저에게만 메세지 보내기
    this.io.to(roomId[1]).emit('receive-message', message);
  }
}
