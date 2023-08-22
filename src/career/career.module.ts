import { Module } from '@nestjs/common';
import { CareerService } from './career.service';
import { CareerController } from './career.controller';

// TypeOrmModule과 entity를 가져와서 등록하자
import { TypeOrmModule } from '@nestjs/typeorm';
import { Career } from 'src/domain/career.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Career])],
  controllers: [CareerController],
  providers: [CareerService],
  exports: [CareerService, TypeOrmModule],
})
export class CareerModule {}
