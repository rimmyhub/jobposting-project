import { Module } from '@nestjs/common';
import { JobpostingService } from './jobposting.service';
import { JobpostingController } from './jobposting.controller';

@Module({
  controllers: [JobpostingController],
  providers: [JobpostingService],
})
export class JobpostingModule {}
