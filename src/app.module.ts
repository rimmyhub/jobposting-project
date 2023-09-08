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
import { ApplicantModule } from './applicant/applicant.module';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comment/comment.module';
import { ChatModule } from './chat/chat.module';
import { ChatGateway } from './chat/chat.geteway';
import { UploadModule } from './upload/upload.module';
import { ScheduleModule } from '@nestjs/schedule';
import { EventsModule } from './events/events.module';
import { JobcrawlerModule } from './jobcrawler/jobcrawler.module';
import { JobPostingSearchModule } from './search/search.module';
import { MailModule } from './mail/mail.module';
import { ChatContentModule } from './chat-content/chat-content.module';
import { ChatgptModule } from './chatgpt/chatgpt.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({ isGlobal: true }),
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
    EventsModule,
    JobcrawlerModule,
    JobPostingSearchModule,
    ChatContentModule,
    ChatgptModule,
  ],
  controllers: [AppController],
  providers: [AppService, ChatGateway],
})
export class AppModule {}
