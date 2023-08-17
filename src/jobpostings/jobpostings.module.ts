import { Module } from '@nestjs/common';
import { JobpostingsService } from './jobpostings.service';
import { JobpostingsController } from './jobpostings.controller';

@Module({
  controllers: [JobpostingsController],
  providers: [JobpostingsService],
})
export class JobpostingsModule {}
