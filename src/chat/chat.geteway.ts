import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

//WebSocketGateway 데코레이터를 사ㅇ하여 웹소켓 관련 기능을 제공하는 클래스 선언
@WebSocketGateway()
export class ChatGateway {
  // WebSocketGateway데코레이터를 사용하여 인스턴스 생성하고 할당
  @WebSocketServer()
  server;

  // @SubscribeMessage 데코레이터를 사용하여 클라이언트로부터 'message' 이벤트를 구독하는 메서드를 선언합니다.
  // 클라이언트가 'message' 이벤트를 보낼 때마다 이 메서드가 호출됩니다.
  // @MessageBody() 데코레이터를 사용하여 메세지의 본문을 추출합니다.
  // 추출한 메세지를 웹소켓 서버의 모든 클라이언트에게 'message' 이벤트로 전달합니다.
  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string): void {
    this.server.emit('message', message);
  }
}
