import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ormConfig } from './orm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AdminsModule } from './admins/admins.module';
import { JobpostingsModule } from './jobpostings/jobpostings.module';
import { AboutmeModule } from './aboutme/aboutme.module';
import { EducationModule } from './education/education.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { CareerModule } from './career/career.module';
import { ResumeModule } from './resume/resume.module';
import { ApplyModule } from './apply/apply.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({ useFactory: ormConfig }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    AdminsModule,
    JobpostingsModule,
    AboutmeModule,
    EducationModule,
    PortfolioModule,
    CareerModule,
    ResumeModule,
    ApplyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
