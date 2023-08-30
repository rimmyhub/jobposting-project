import puppeteer from 'puppeteer';
import cheerio from 'cheerio';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Jobposting } from 'src/domain/jobposting.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from 'src/domain/company.entity';
import { faker } from '@faker-js/faker';

@Injectable()
export class JobcrawlerService {
  constructor(
    @InjectRepository(Jobposting)
    private readonly jobpostingRepository: Repository<Jobposting>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  // 퍼피티어 데이터 기본 실행
  private async getPuppeteerData(url: string): Promise<string> {
    // 브라우저를 실행한다.
    // 옵션으로 headless모드를 끌 수 있다.
    const browser = await puppeteer.launch({
      headless: 'new',
    });
    // 새로운 페이지를 연다.
    const page = await browser.newPage();
    // 페이지의 크기를 설정한다
    await page.setViewport({
      width: 1366,
      height: 768,
    });
    // 초수를 무제한으로 설정한다
    page.setDefaultNavigationTimeout(0);

    //URL에 접속한다
    await page.goto(url);
    // 콘텐츠를 실행하고
    const content = await page.content();
    // 브라우저를 종료한다
    browser.close();

    return content;
  }

  // 크롤링
  // private async parsing(page: string, companyId: string) {
  //   const $ = cheerio.load(page);
  //   const companies: {
  //     companyId: number;
  //     password?: string; //랜덤 생성
  //     title?: string; //회사명
  //     introduction?: string; //산업
  //     business?: string; // 뭐하는 곳인지
  //     employees?: string; // 사원 수
  //     image?: string;
  //     website: string;
  //     address: string;
  //   }[] = [];
  //   let company;
  //   const $companyList = $('.tbRow');
  //   $companyList.each((idx, node) => {
  //     // 이메일
  //     const email = faker.internet.email(); // 랜덤한 이메일

  //     // 비밀번호
  //     const password = faker.internet.password(); // 랜덤한 패스워드 생성

  //     // 회사명
  //     const title =
  //       $(node).find('.tbRow > .coInfo > h4.hd_4').text().trim() || '회사 이름';

  //     // 소개
  //     const introduction = faker.lorem.paragraph();

  //     // 산업
  //     const business =
  //       $(node).find(".tbList dt:contains('산업')").next('dd').text().trim() ||
  //       '기타 산업';

  //     // 사원수
  //     const employees =
  //       $(node)
  //         .find(".tbList dt:contains('사원수')")
  //         .next('dd')
  //         .text()
  //         .trim() || '0';

  //     // 기업 이미지
  //     const image =
  //       'http:' + $(node).find('.coLogo img').attr('src') ||
  //       'https://img.freepik.com/free-photo/central-business-district-in-singapore_335224-638.jpg';

  //     company = {
  //       companyId: Number(companyId),
  //       email, //랜덤 생성
  //       password, //랜덤 생성
  //       title, //회사명
  //       introduction, //산업
  //       business, // 뭐하는 곳인지
  //       employees, // 사원 수
  //       image, // 회사 이미지
  //     };
  //     companies.push(company);
  //   });

  //   const $companyLocation = $('.artReadWork');
  //   $companyLocation.each((idx, node) => {
  //     const address =
  //       $(node).find('.address > strong.girIcn').text().trim() || '주소';

  //     companies[idx].address = address; //주소
  //   });

  //   const $companyWebsite = $('.artReadJobSum');
  //   $companyWebsite.each((idx, node) => {
  //     const websiteLabel = $(node)
  //       .find('.tbList dt')
  //       .filter(function () {
  //         return $(this).text().trim() === '홈페이지';
  //       });
  //     const website =
  //       websiteLabel.next().find('a.devCoHomepageLink').attr('href') ||
  //       '웹 사이트';

  //     companies[idx].website = website; //주소
  //   });

  //   // console.log('채용 공고 크롤링 부분:', jobs);
  //   // console.log('회사 크롤링 부분:', companies);
  //   return companies;
  // }

  async companyParsing(page: string) {
    const $ = cheerio.load(page);
    // const companies: {
    //   companyId: number;
    //   password?: string; //랜덤 생성
    //   title?: string; //회사명
    //   introduction?: string; //산업
    //   business?: string; // 뭐하는 곳인지
    //   employees?: string; // 사원 수
    //   image?: string;
    //   website: string;
    //   address: string;
    // }[] = [];
    let companyEntity: Company;
    const $companyList = $('.artReadCoInfo');
    $companyList.each((idx, node) => {
      // 이메일faker.internet.email()
      // const email = 'abcdefg@naver.com'; // 랜덤한 이메일
      const email = faker.internet.email(); // 랜덤한 이메일

      // 비밀번호
      const password = faker.internet.password(); // 랜덤한 패스워드 생성

      // 회사명
      const title =
        $(node).find('.tbRow > .coInfo > h4.hd_4').text().trim() || '회사 이름';

      // 소개
      const introduction = faker.lorem.paragraph();

      // 산업
      const business =
        $(node).find(".tbList dt:contains('산업')").next('dd').text().trim() ||
        '기타 산업';

      // 사원수
      const employees =
        $(node)
          .find(".tbList dt:contains('사원수')")
          .next('dd')
          .text()
          .trim() || '0';

      // 기업 이미지
      const image =
        'http:' + $(node).find('.coLogo img').attr('src') ||
        'https://img.freepik.com/free-photo/central-business-district-in-singapore_335224-638.jpg';

      // company = {
      //   companyId: Number(companyId),
      //   email, //랜덤 생성
      //   password, //랜덤 생성
      //   title, //회사명
      //   introduction, //산업
      //   business, // 뭐하는 곳인지
      //   employees, // 사원 수
      //   image, // 회사 이미지
      // };
      companyEntity = this.companyRepository.create({
        // id: Number(companyId),
        email,
        password,
        title,
        introduction,
        business,
        employees,
        image,
      });
      // companies.push(company);
    });

    const $companyLocation = $('.artReadWork');
    $companyLocation.each((idx, node) => {
      const address =
        $(node).find('.address > strong.girIcn').text().trim() || '주소';

      companyEntity.address = address; //주소
    });

    const $companyWebsite = $('.artReadJobSum');
    $companyWebsite.each((idx, node) => {
      const websiteLabel = $(node)
        .find('.tbList dt')
        .filter(function () {
          return $(this).text().trim() === '홈페이지';
        });
      const website =
        websiteLabel.next().find('a.devCoHomepageLink').attr('href') ||
        '웹 사이트';

      companyEntity.website = website; //주소
    });
    console.log(companyEntity);
    const isExist = await this.companyRepository.findOne({
      where: { title: companyEntity.title },
    });
    if (isExist) return;
    await this.companyRepository.insert(companyEntity);

    // console.log('채용 공고 크롤링 부분:', jobs);
    // console.log('회사 크롤링 부분:', companies);
    return companyEntity;
  }

  jobParsing(page) {
    const $ = cheerio.load(page);
    const jobs = [];
    // 채용공고 크롤링
    const $jobList = $('.devloopArea');

    $jobList.filter((idx, node) => {
      // 회사 아이디
      const dataInfo = $(node).attr('data-info'); // data-info 속성 값 가져오기
      const companyId = dataInfo.split('|')[0].trim() || 1; // '|'로 분리된 값 중 첫 번째 값을 가져옵니다

      // 회사이름
      const companyTitle = $(node)
        .find('.tplCo > a.link.normalLog')
        .text()
        .trim();

      // 채용공고 타이틀
      const title = $(node)
        .find(' .titBx > strong > a.normalLog:eq(0)')
        .text()
        .trim();
      if (title === '') {
        return false;
      }

      // 경력
      const career = $(node)
        .find('.titBx > .etc:eq(0) > .cell:eq(0)')
        .text()
        .trim();

      // 급여 관련 // 공백은 '면접 후 결정'으로 변경
      const salary =
        $(node)
          .find('.titBx > .etc:eq(0) > .cell:eq(4)')
          .text()
          .trim()
          .replace(
            /\s*주임급\s*|\s*사원급 외\s*|\s*사원급\s*|\s*주임~대리급\s*/g,
            '',
          ) || '면접 후 결정';

      // 학력
      const education = $(node)
        .find('.titBx > .etc:eq(0) > .cell:eq(1)')
        .text()
        .trim();

      // 정규직 관련
      const workType = $(node)
        .find('.titBx > .etc:eq(0) > .cell:eq(3)')
        .text()
        .trim()
        .replace(/\s*외\s*/g, ''); // 여백과 "외" 문자열을 제거
      // 지역
      const workArea = $(node)
        .find('.titBx > .etc:eq(0) > .cell:eq(2)')
        .text()
        .trim();

      // 기타 내용
      const content = $(node).find('.titBx > .dsc:eq(0)').text().trim();

      // 채용 마감일
      const dueDate =
        $(node).find('.odd > .date:eq(0)').text().trim() || '상시 채용';

      const jobposting = {
        companyTitle,
        companyId: Number(companyId),
        title,
        career,
        salary,
        education,
        workType,
        workArea,
        content,
        dueDate,
      };

      // const jobposting = this.jobpostingRepository.create({
      //   title,
      //   career,
      //   salary,
      //   education,
      //   workType,
      //   workArea,
      //   content,
      //   dueDate,
      // });
      jobs.push(jobposting);
    });
    console.log(jobs);
    return jobs;
  }

  // @Cron('0 8 * * *') // 매일 오전 8시에 실행
  async crawlJobs() {
    let jobInfo: {
      companyTitle: string;
      companyId: number;
      title: string;
      career: string;
      salary: string;
      education: string;
      workType: string;
      workArea: string;
      content: string;
      dueDate: string;
    }[] = [];
    const companyLists = [];

    console.time('코드 실행시간');

    let i = 1;
    while (i <= 1) {
      const jobpostingUrl = `https://www.jobkorea.co.kr/recruit/joblist?menucode=local&localorder=1#anchorGICnt_${i}`;
      const jobpostingContent = await this.getPuppeteerData(jobpostingUrl);
      jobInfo = this.jobParsing(jobpostingContent);
      // console.log('jobInfo---------', jobInfo);
      let companyInfo;
      for (const job of jobInfo) {
        const existingCompany = await this.jobpostingRepository.findOne({
          // 회사아이디가 기존에 있으면 파싱안되게..
          where: { id: job.companyId },
        });
        if (!existingCompany) {
          const companyUrl = `https://www.jobkorea.co.kr/Recruit/GI_Read/${job.companyId}?rPageCode=AM&logpath=21`; // 상세 페이지 링크 생성
          const companyContent = await this.getPuppeteerData(companyUrl); // 상세 페이지 크롤링
          companyInfo = this.companyParsing(companyContent); // 추가 데이터 추가
          companyLists.push(companyInfo);
        }
      }
      // jobLists.push(jobInfo);
      companyLists.push(companyInfo);
      i++;

      // await this.delay(5000); // 각페이지 크롤링 후 10초 대기
    }

    console.timeEnd('코드 실행시간');

    // const companyEntities: Company[] = [];
    const jobpostingEntities: Jobposting[] = [];

    // companyLists.forEach((company) => {
    //   const companyEntity = this.companyRepository.create({
    //     id: company.companyId,
    //     email: company.email,
    //     password: company.password,
    //     title: company.title,
    //     introduction: company.introduction,
    //     business: company.business,
    //     employees: company.employees,
    //     image: company.image,
    //     website: company.website,
    //     address: company.website,
    //   });
    //   companyEntities.push(companyEntity);
    // });
    jobInfo.forEach(async (job) => {
      const company = await this.companyRepository.findOne({
        where: { title: job.companyTitle },
      });
      console.log(company);
      if (!company) return;

      const jobEntity = this.jobpostingRepository.create({
        // companyId: job.companyId,
        company: { id: company.id },
        companyId: company.id,
        title: job.title,
        career: job.career,
        salary: job.salary,
        education: job.education,
        workType: job.workType,
        workArea: job.workArea,
        content: job.content,
        dueDate: job.dueDate,
      });
      jobpostingEntities.push(jobEntity);
    });

    // await this.companyRepository.insert(companyEntities);
    await this.jobpostingRepository.insert(jobpostingEntities);

    return jobInfo;
  }
  // private delay(ms: number) {
  //   return new Promise((resolve) => setTimeout(resolve, ms));

  //   // 프로미스 객체 생성해서 시간이 지난후에 성공 상태로 이행,setTimeout에 의해 제공되는 대기 시간만큼의 시간이 지난 후에 resolve 함수를 호출함으로써 발생
  // }
}
