import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => ({
        transport: {
          host: 'smtp.gmail.com', // 이메일 전송에 사용할 SMTP 서버의 호스트 주소
          port: 587, // SMTP 서버의 포트 번호
          secure: false,
          // Gmail SMTP 서버의 포트 587은 STARTTLS를 사용하여 암호화를 시도
          // 그렇기 때문에 secure: true로 설정하면 SSL/TLS 연결이 이미 활성화된 상태에서 추가로 암호화를 시도하게 되어 오류가 발생
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
          },
        },
      }),
    }),
  ],
  providers: [MailService],
  controllers: [MailController],
})
export class MailModule {}
