import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from '../domain/chat.entity';
import { ChatContentService } from '../chat-content/chat-content.service';
import { ChatContentModule } from '../chat-content/chat-content.module';

@Module({
  imports: [ChatContentModule, TypeOrmModule.forFeature([Chat])],
  controllers: [ChatController],
  providers: [ChatService, ChatContentService],
  exports: [ChatService],
})
export class ChatModule {}
