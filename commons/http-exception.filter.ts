import {
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  Catch,
} from '@nestjs/common';
import { Response } from 'express';
// @Catch(HttpException) <= 애가 없어서 계속
// exception.getStatus is not a function 오류가 떠서 추가했습니다.
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const message = exception.message;

    response.status(status).json({ message });

    console.log('===================');
    console.log('예외가 발생했습니다.');
    console.log('예외내용', message);
    console.log('예외코드', status);
    console.log('===================');
  }
}
