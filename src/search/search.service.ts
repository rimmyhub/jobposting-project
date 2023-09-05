import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  OpenSearchClient,
  AcceptInboundConnectionCommand,
  AcceptInboundConnectionCommandInput,
} from '@aws-sdk/client-opensearch';

const AWS = require('aws-sdk');
const configService = new ConfigService();

// const protocol = 'http://localhost/';
// const protocol = 'https://;
// const port = 9200;

@Injectable()
export class SearchService {
  private readonly client: OpenSearchClient;

  // 클라이언트 설정 및
  constructor() {
    this.client = new OpenSearchClient({ region: 'us-east-1' });

    const params: AcceptInboundConnectionCommandInput = {
      /** input parameters */
      ConnectionId: '123',
    };
    const command = new AcceptInboundConnectionCommand(params);
  }

  // 인덱스 생성 함수
  async createIndex() {
    console.log('Creating index:'); // 콘솔확인 OK
    const index_name = 'winner'; // 생성할 인덱스 네임
    const settings = {
      settings: {
        index: {
          number_of_shards: 1,
          number_of_replicas: 1,
        },
      },
    };

    // var response = await this.client.create({
    //   index: index_name,
    //   body: settings,
    // });

    // console.log(response.body);
    // return response;
  }

  // 검색 기능
  async searchJobs(text: string) {
    console.log('hi'); // 콘솔 확인 OK
    // const indexes = await this.client.search({
    //   index: 'winner',
    //   body: {
    //     query: {
    //       match: { title: text },
    //     },
    //   },
    // });
    // console.log('123');
    // console.log(indexes);

    // return indexes;
  }
}

// node: configService.get('HOST'), // aws opensearch 엔드포인트
// ...AwsSigv4Signer({
//   region: configService.get('REGION'), // 버지니아 북부 us-east-1
//   service: configService.get('SERVICE'), // es
//   getCredentials: () =>
//     new Promise((resolve, reject) => {
//       AWS.config.getCredentials((err, credentials) => {
//         if (err) {
//           console.error('Error getting AWS credentials:', err);
//           reject(err);
//         } else {
//           resolve(credentials);
//         }
//       });
//     }),
// }),
