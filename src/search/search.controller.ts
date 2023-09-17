import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { SearchService } from './search.service';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('api/search')
@ApiTags('검색 API')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  // 인덱스 생성 api
  @Post('index')
  @ApiOperation({ summary: '인덱스 생성 API', description: '인덱스 생성' })
  @ApiCreatedResponse({ description: '인덱스 생성' })
  async createIndex() {
    const index = await this.searchService.createIndex();
    return index;
  }

  // 데이터 검색 api
  @Post('data')
  @ApiOperation({ summary: '데이터 검색 API', description: '데이터 검색' })
  @ApiCreatedResponse({ description: '데이터 검색' })
  async searchData(@Body('keyword') keyword: string) {
    const indexes = await this.searchService.searchData(keyword);
    return indexes;
  }

  // openSearch DB 조회용 API
  @Get()
  @ApiOperation({
    summary: 'openSearch DB 조회용 API',
    description: 'openSearch DB 조회용',
  })
  @ApiCreatedResponse({ description: 'openSearch DB 조회용' })
  async searchDataFunction() {
    return await this.searchService.searchDataFunction();
  }

  // 인덱스 삭제
  @Delete()
  @ApiOperation({ summary: '인덱스 삭제 API', description: '인덱스 삭제' })
  @ApiCreatedResponse({ description: '인덱스 삭제' })
  async indexDelete() {
    return this.searchService.indexDelete();
  }
}
