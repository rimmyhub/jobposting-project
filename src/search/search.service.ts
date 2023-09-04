import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@opensearch-project/opensearch';
import { AwsSigv4Signer } from '@opensearch-project/opensearch/aws';

const AWS = require('aws-sdk');
const configService = new ConfigService();

@Injectable()
export class SearchService {
  private readonly client: Client;

  constructor() {
    this.client = new Client({
      ...AwsSigv4Signer({
        region: configService.get('REGION'),
        service: configService.get('SERVICE'),
        getCredentials: () =>
          new Promise((resolve, reject) => {
            AWS.config.getCredentials((err, credentials) => {
              if (err) {
                console.error('Error getting AWS credentials:', err);
                reject(err);
              } else {
                resolve(credentials);
              }
            });
          }),
      }),
      node: configService.get('HOST'),
    });
  }

  async createIndex() {
    console.log('Creating index:');

    const index_name = 'winner';
    const settings = {
      settings: {
        index: {
          number_of_shards: 1,
          number_of_replicas: 1,
        },
      },
    };

    var response = await this.client.indices.create({
      index: index_name,
      body: settings,
    });

    console.log(response.body);
    return response;
  }

  async searchJobs(text: string) {
    console.log('hi');
    const indexes = await this.client.search({
      index: 'winner',
      body: {
        query: {
          match: { title: text },
        },
      },
    });
    console.log('123');
    console.log(indexes);

    return indexes;
  }
}
