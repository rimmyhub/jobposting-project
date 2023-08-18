import { Module } from '@nestjs/common';
import { JobpostingService } from './jobposting.service';
import { JobpostingController } from './jobposting.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Jobposting } from 'src/domain/jobposting.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Jobposting])],
  controllers: [JobpostingController],
  providers: [JobpostingService],
})
export class JobpostingModule {}
