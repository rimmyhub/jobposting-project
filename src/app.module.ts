import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ormConfig } from './orm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { CompanyModule } from './company/company.module';
import { JobpostingModule } from './jobposting/jobposting.module';
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
    UserModule,
    CompanyModule,
    JobpostingModule,
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
