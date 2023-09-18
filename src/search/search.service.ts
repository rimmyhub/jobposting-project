import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@elastic/elasticsearch';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// 회사 데이터 가져오기 위한 import
import { Company } from 'src/domain/company.entity';
// 채용공고 데이터 가져오기 위한 import
import { Jobposting } from 'src/domain/jobposting.entity';

const configService = new ConfigService();

@Injectable()
export class SearchService {
  private readonly client: Client;

  // 클라이언트 설정 및
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(Jobposting)
    private readonly jobpostingRepository: Repository<Jobposting>,
  ) {
    this.client = new Client({
      node: configService.get('AWS_OPEN_SEARCH_ENDPOINT'),
      auth: {
        username: configService.get('AWS_OPEN_SEARCH_USERNAME'),
        password: configService.get('AWS_OPEN_SEARCH_PASSWORD'),
      },
      requestTimeout: 100000,
      // log: 'trace',
    });

    // 핑 체크 : 서버 -> 클러스터 , {} => 기본 설정으로 핑을 보냄
    this.client.ping({}, function err(error) {
      if (error) {
        console.log(error);
        console.error('Elasticsearch cluster is down!');
      } else {
        console.log('Elasticsearch cluster is up!');
      }
    });
  }

  // 인덱스 생성
  async createIndex() {
    try {
      const indexName = 'winner_test';
      // 인덱스 생성
      await this.createIndexFunction(indexName);
      // db 데이터 저장
      await this.insertDataFunction();
      // 리턴
      return HttpStatus.OK;
    } catch (error) {
      console.error('Error creating index:', error);
      throw new HttpException(
        '"Error creating index."',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // 인덱스 생성 및 조건설정 함수
  async createIndexFunction(indexName: string) {
    const indexExists = await this.client.indices.exists({ index: indexName });
    // 예외처리
    if (!indexExists.body) {
      await this.client.indices.create({
        index: indexName,
        body: {
          settings: {
            analysis: {
              tokenizer: {
                seunjeon: {
                  type: 'seunjeon_tokenizer',
                },
              },
              filter: {
                autocomplete_filter: {
                  type: 'edge_ngram',
                  min_gram: 1,
                  max_gram: 20,
                },
              },
              analyzer: {
                my_analyzer: {
                  type: 'custom',
                  tokenizer: 'seunjeon',
                },
                autocomplete: {
                  type: 'custom',
                  tokenizer: 'standard',
                  filter: ['lowercase', 'autocomplete_filter'],
                },
              },
            },
          },
          mappings: {
            properties: {
              title: {
                type: 'text',
                analyzer: 'my_analyzer',
                search_analyzer: 'my_analyzer',
                fields: {
                  keyword: {
                    type: 'keyword',
                    ignore_above: 256,
                  },
                },
              },
              job: {
                type: 'text',
                analyzer: 'my_analyzer',
                search_analyzer: 'my_analyzer',
                fields: {
                  keyword: {
                    type: 'keyword',
                    ignore_above: 256,
                  },
                },
              },
              workArea: {
                type: 'text',
                analyzer: 'my_analyzer',
                search_analyzer: 'my_analyzer',
                fields: {
                  keyword: {
                    type: 'keyword',
                    ignore_above: 256,
                  },
                },
              },
              content: {
                type: 'text',
                analyzer: 'my_analyzer',
                search_analyzer: 'my_analyzer',
                fields: {
                  keyword: {
                    type: 'keyword',
                    ignore_above: 256,
                  },
                },
              },
              workType: {
                type: 'text',
                analyzer: 'my_analyzer',
                search_analyzer: 'my_analyzer',
                fields: {
                  keyword: {
                    type: 'keyword',
                    ignore_above: 256,
                  },
                },
              },
              business: {
                type: 'text',
                analyzer: 'my_analyzer',
                search_analyzer: 'my_analyzer',
                fields: {
                  keyword: {
                    type: 'keyword',
                    ignore_above: 256,
                  },
                },
              },
              address: {
                type: 'text',
                analyzer: 'my_analyzer',
                search_analyzer: 'my_analyzer',
                fields: {
                  keyword: {
                    type: 'keyword',
                    ignore_above: 256,
                  },
                },
              },
              introduction: {
                type: 'text',
                analyzer: 'my_analyzer',
                search_analyzer: 'my_analyzer',
                fields: {
                  keyword: {
                    type: 'keyword',
                    ignore_above: 256,
                  },
                },
              },
            },
          },
        },
      });
    }
  }

  // DB데이터 openSearch에 저장시키는 코드
  async insertDataFunction() {
    const indexName = 'winner_test';
    try {
      const companyData = await this.companyRepository.find();
      // 회사 데이터 저장
      for (const key of companyData) {
        await this.client.index({
          index: indexName,
          body: key,
        });
      }

      const jobpostingData = await this.jobpostingRepository.find();
      // 채용공고 데이터 저장
      for (const key of jobpostingData) {
        await this.client.index({
          index: indexName,
          body: key,
        });
      }

      return `${indexName}에 데이터 저장 완료!! ${HttpStatus.OK}`;
    } catch (err) {
      console.error(err);
      throw new HttpException(
        `${indexName}에 데이터 저장을 실패하였습니다.`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // 데이터 조회
  async searchData(keyword: string) {
    console.time('search');
    try {
      const indexName = 'winner_test';
      const data = await this.searchIndexFunction(indexName, keyword);

      if (data.length === 0) {
        throw new HttpException(`데이터가 없습니다.`, HttpStatus.BAD_REQUEST);
      }
      console.timeEnd('search');
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw new HttpException('Error fetching data.', HttpStatus.BAD_REQUEST);
    }
  }

  // 데이터 검색함수
  async searchIndexFunction(indexName: string, keyword: string) {
    try {
      const { body } = await this.client.search({
        index: indexName,
        body: {
          query: {
            multi_match: {
              query: keyword,
              fields: [
                'title',
                'business',
                'job',
                'workArea',
                'workType',
                'content',
                'address',
                'instruction',
              ],
            },
          },
        },
        size: 50,
      });
      console.log('검색 결과:', body);
      return body.hits.hits;
    } catch (error) {
      console.error('인덱스 검색 중 오류:', error);
    }
  }

  // openSearch Data 조회
  async searchDataFunction() {
    const indexName = 'winner_test';
    try {
      const { body } = await this.client.search({
        index: indexName,
        body: {
          query: {
            match_all: {},
          },
        },
      });
      console.log('검색 결과:', body);
      return body;
    } catch (error) {
      console.error('인덱스 검색 중 오류:', error);
    }
  }

  // 인덱스 삭제
  async indexDelete() {
    const indexName = 'winner_test';
    try {
      const existIndex = await this.client.indices.exists({ index: indexName });
      if (existIndex) {
        const deleteIndex = await this.client.indices.delete({
          index: indexName,
        });
        return deleteIndex;
      }
      return HttpStatus.OK;
    } catch (err) {
      console.log(err);
      throw new HttpException(
        '인덱스 삭제에 실패하였습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
