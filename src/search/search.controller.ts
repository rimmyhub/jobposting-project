import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('api/search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  // 진행중
  // 인덱스 생성 api
  @Post()
  async createIndex() {
    console.log('hi');
    const index = await this.searchService.createIndex();
  }

  // 데이터 검색 api
  @Get()
  async searchJobs(@Req() req, @Body('text') text: string) {
    // console.log(req);
    console.log(req.headers);
    console.log(text);
    const indexes = await this.searchService.searchJobs(text);
    return indexes;
  }
}
