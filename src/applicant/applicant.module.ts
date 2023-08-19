import { Module } from '@nestjs/common';
import { ApplicantService } from './applicant.service';
import { ApplicantController } from './applicant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Applicant } from 'src/domain/applicant.entity';
import { User } from 'src/domain/user.entity';
import { Jobposting } from 'src/domain/jobposting.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Applicant, User, Jobposting])],
  controllers: [ApplicantController],
  providers: [ApplicantService],
})
export class ApplicantModule {}
