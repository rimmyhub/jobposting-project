import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('/api/upload')
@ApiTags('이미지 업로드 API')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @ApiOperation({ summary: '이미지 업로드 API', description: '이미지 업로드' })
  @ApiCreatedResponse({ description: '이미지 업로드' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile()
    file: Express.MulterS3.File,
  ) {
    const photo = await this.uploadService.upload(file);
    return photo;
  }
}
