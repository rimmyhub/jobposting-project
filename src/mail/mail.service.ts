import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  //   sendMail(): void {
  //     // this.mailerService.sendMail 메소드를 사용하여 이메일을 전송
  //     this.mailerService.sendMail({
  //       to: 'paul1222@naver.com',
  //       from: 'paul12220@naver.com',
  //       subject: '회원가입 인증 이메일',
  //       text: '이메일을 확인하고 회원가입을 완료하세요.',
  //       html: '<b>이메일을 확인하고 회원가입을 완료하세요.</b>',
  //     });
  //   }

  async sendMail(email: string): Promise<void> {
    try {
      const result = await this.mailerService.sendMail({
        to: email,
        from: 'jobposting@gmail.com',
        subject: '회원가입 인증 이메일',
        text: '이메일을 확인하고 회원가입을 완료하세요.',
        html: '<b>이메일을 확인하고 회원가입을 완료하세요.</b>',
      });
      console.log(result);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        '인증 이메일 전송에 실패했습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
