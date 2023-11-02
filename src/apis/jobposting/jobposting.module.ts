import { Module } from '@nestjs/common';
import { JobpostingService } from './jobposting.service';
import { JobpostingController } from './jobposting.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CacheModule } from '@nestjs/cache-manager';
import { Company } from '../domain/company.entity';
import { Jobposting } from '../domain/jobposting.entity';

@Module({
  imports: [
    CacheModule.register({ ttl: 10, max: 10 }),
    TypeOrmModule.forFeature([Jobposting, Company]),
  ],
  controllers: [JobpostingController],
  providers: [JobpostingService],
  exports: [JobpostingService, TypeOrmModule],
})
export class JobpostingModule {}
