import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { SearchService } from './search.service';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('api/search')
@ApiTags('검색 API')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  // 진행중
  // 인덱스 생성 api
  @Post()
  @ApiOperation({ summary: '인덱스 생성 API', description: '인덱스 생성' })
  @ApiCreatedResponse({ description: '인덱스 생성' })
  async createIndex() {
    console.log('hi');
    const index = await this.searchService.createIndex();
    return index;
  }

  // 데이터 검색 api
  @Get()
  @ApiOperation({ summary: '데이터 검색 API', description: '데이터 검색' })
  @ApiCreatedResponse({ description: '데이터 검색' })
  async searchJobs(@Req() req, @Body('text') text: string) {
    // console.log(req);
    console.log(req.headers);
    console.log(text);
    const indexes = await this.searchService.searchJobs(text);
    return indexes;
  }
}
