import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobpostingModule } from '../jobposting/jobposting.module';
import { CompanyModule } from '../company/company.module';
import { JobpostingService } from '../jobposting/jobposting.service';
import { CompanyService } from '../company/company.service';

@Module({
  imports: [CompanyModule, JobpostingModule, TypeOrmModule.forFeature([])],
  controllers: [SearchController],
  providers: [SearchService, CompanyService, JobpostingService],
  exports: [SearchService],
})
export class SearchModule {}
