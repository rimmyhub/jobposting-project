import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { UserGuard } from 'src/auth/jwt/jwt.user.guard';

@Controller('/api/upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @UseGuards(UserGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  // 업로드할 파일의 필드이름 설정

  //@UploadedFile() 데코레이터를 사용하여 업로드된 파일의 정보를 파라미터로 받음
  async uploadFile(
    // 파일생성하고
    @UploadedFile(
      // jpeg 파일타입만 가능하다고 만듬
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 }), // 최대 파일 크기 유효성 검사기를 제공할 수 있음 100바이트
          // 1000보다 크면 메세지 표시됨
          //  1024 * 1024 = 1MB로 수정
          new FileTypeValidator({ fileType: 'image/jpeg' }), // jpeg 파일타입만 가능하다고 만듬
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    //업로드된 파일의 원래 이름과 버퍼를 UploadService의 upload 메서드로 전달
    await this.uploadService.upload(file.originalname, file.buffer);
  }
}
