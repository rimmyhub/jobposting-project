import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { CompanyService } from 'src/company/company.service';
import { CompanyModule } from 'src/company/company.module';
import { JobpostingService } from 'src/jobposting/jobposting.service';
import { JobpostingModule } from 'src/jobposting/jobposting.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [CompanyModule, JobpostingModule, TypeOrmModule.forFeature([])],
  controllers: [SearchController],
  providers: [SearchService, CompanyService, JobpostingService],
  exports: [SearchService],
})
export class SearchModule {}
