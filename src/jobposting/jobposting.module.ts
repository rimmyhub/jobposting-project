import { Module } from '@nestjs/common';
import { JobpostingService } from './jobposting.service';
import { JobpostingController } from './jobposting.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Jobposting } from 'src/domain/jobposting.entity';
import { Company } from 'src/domain/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Jobposting, Company])],
  controllers: [JobpostingController],
  providers: [JobpostingService],
})
export class JobpostingModule {}
