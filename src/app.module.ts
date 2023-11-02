import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ormConfig } from './orm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';
import { SwaggerModule } from '@nestjs/swagger';
import * as redisStore from 'cache-manager-redis-store';
import { UploadModule } from './apis/upload/upload.module';
import { UserModule } from './apis/user/user.module';
import { JobpostingModule } from './apis/jobposting/jobposting.module';
import { AboutmeModule } from './apis/aboutme/aboutme.module';
import { EducationModule } from './apis/education/education.module';
import { PortfolioModule } from './apis/portfolio/portfolio.module';
import { CareerModule } from './apis/career/career.module';
import { ResumeModule } from './apis/resume/resume.module';
import { ApplicantModule } from './apis/applicant/applicant.module';
import { AuthModule } from './apis/auth/auth.module';
import { CommentModule } from './apis/comment/comment.module';
import { ChatModule } from './apis/chat/chat.module';
import { MailModule } from './apis/mail/mail.module';
import { JobcrawlerModule } from './apis/jobcrawler/jobcrawler.module';
import { SearchModule } from './apis/search/search.module';
import { ChatContentModule } from './apis/chat-content/chat-content.module';
import { ChatgptModule } from './apis/chatgpt/chatgpt.module';
import { CompanyModule } from './apis/company/company.module';
import { ChatGateway } from './apis/chat/chat.geteway';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.CACHE_REDIS_HOST,
      port: process.env.CACHE_REDIS_PORT,
    }),
    TypeOrmModule.forRootAsync({ useFactory: ormConfig }),
    UploadModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    UserModule,
    CompanyModule,
    JobpostingModule,
    AboutmeModule,
    EducationModule,
    PortfolioModule,
    CareerModule,
    ResumeModule,
    ApplicantModule,
    AuthModule,
    CommentModule,
    ChatModule,
    MailModule,
    JobcrawlerModule,
    SearchModule,
    ChatContentModule,
    ChatgptModule,
    SwaggerModule,
  ],
  controllers: [AppController],
  providers: [AppService, ChatGateway],
})
export class AppModule {}
