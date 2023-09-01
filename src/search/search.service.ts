import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@opensearch-project/opensearch';

const configService = new ConfigService();

// 도메인 세팅
// const host = configService.get('HOST');
// const auth = configService.get('AUTH');
// const openSearchHost = `https://${auth}@${host}`;

@Injectable()
export class SearchService {
  private readonly client: Client;

  // Elasticsearch를 사용하기 위해 객체를 생성
  constructor() {
    this.client = new Client({
      node: configService.get('HOST'),
    });
  }

  async createIndex() {
    // 인덱스 생성
    const indexes = await this.client.indices.create({ index: 'winner' });
    console.log(indexes);
    // 더미데이터
    const document = {
      title: '라이온킹',
      author: '난몰라',
      year: '2018',
      genre: '하이틴',
    };
    // 인덱스에 더미데이터 저장
    const createDocument = await this.client.index({
      index: 'winner',
      body: document,
    });
    console.log(createDocument);
    // 반환값
    return createDocument;
  }

  async searchJobs(text: string) {
    console.log('hi');
    const indexes = await this.client.search({
      index: 'winner', // Elasticsearch 에서 검색할 인덱스 이름
      body: {
        query: {
          match: { title: text }, // title 필드에서 받아온 text 를 포함하는 값 검색
        },
      },
    });
    console.log('123');
    console.log(indexes);

    return indexes;
  }
}
