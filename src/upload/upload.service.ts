import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  //private readonly s3Client라는 S3Client 인스턴스를 클래스 내에 생성. 이 클라이언트는 AWS S3 서비스와 상호 작용
  private readonly s3Client = new S3Client({
    //생성자를 통해 ConfigService 인스턴스를 주입. 이를 통해 AWS S3 지역(region)을 가져올 수 있음
    region: this.configService.getOrThrow('AWS_S3_REGION'),
  });

  constructor(private readonly configService: ConfigService) {}

  // 업로드 방법 정의하기
  // 파일 업로드 처리
  async upload(fileName: string, file: Buffer) {
    // s3클라이언트를 통해 PutObjectCommand 생성
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME, // 업로드할 S3버킷 이름
        Key: fileName, // 업로드된 파일의 S3 버킷 내 경로
        // 저장된 사진을 불러올때 키값으로 가져옴 경로에 저장된 걸 가져옴
        // 각각의 사용자가 이미지를 넣고 그것을 불러오는 건 어떻게 해야하는지?
        Body: file, // 업로드할 데이터 지정
      }),
    );
  }
}
