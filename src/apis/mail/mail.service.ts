import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(email: string, code: string): Promise<void> {
    try {
      const result = await this.mailerService.sendMail({
        to: email,
        from: {
          name: '잡포스팅',
          address: 'jobposting@gmail.com',
        },
        subject: '회원가입 인증 코드',
        text: `회원가입을 위한 인증 코드는 ${code} 입니다.`,
        html: `<p>회원가입을 위한 인증 코드는 <strong>${code}</strong> 입니다.</p>`,
      });
      console.log(result);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        '인증 코드 전송에 실패했습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
