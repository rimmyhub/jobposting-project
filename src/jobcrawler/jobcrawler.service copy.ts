// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Jobposting } from 'src/domain/jobposting.entity';
// import { Repository } from 'typeorm';
// // import puppeteer from 'puppeteer';
// import cheerio from 'cheerio';
// import { Job } from 'src/utils/job.interface';
// import { faker } from '@faker-js/faker';
// import { Company } from 'src/domain/company.entity';

// @Injectable()
// export class JobcrawlerService {
//   constructor(
//     @InjectRepository(Jobposting)
//     private readonly jobpostingRepository: Repository<Jobposting>,
//     @InjectRepository(Company)
//     private readonly companyRepository: Repository<Company>,
//   ) {}

//   // 퍼피티어 실행
//   private async getPuppeteerData(url: string): Promise<string> {
//     // 퍼피티어 실행 url string으로 선언

//     try {
//       const browser = await puppeteer.launch({ headless: 'new' });
//       // 브라우저를 new로 선언하여 브라우저창을 표시하지 않고 실행
//       const page = await browser.newPage();
//       // 위에서 실행한 브라우저 인스턴스에서 새로운 페이지를 생성
//       await page.setViewport({
//         width: 1366,
//         height: 768,
//       });
//       page.setDefaultNavigationTimeout(0);
//       // 페이지의 네비게이션 타임아웃을 설정, 0은 타임아웃을 무한대로 설정
//       await page.goto(url);
//       // 생성한 페이지를 특정 URL로 이동시킵니당.
//       const content = await page.content();
//       // 페이지의 내용을 가져와서 content변수에 저장
//       browser.close();
//       // 브라우저를 닫습니다.
//       return content;
//       // 가져온 웹 페이지의 내용을 반환합니다.
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   // 회사 정보 파싱

//   companyParsing(page) {
//     const $ = cheerio.load(page);
//     // cheerio를 사용하여 주어진 HTML페이지를 로드하고 $ 변수에 해당 페이지의 선택자를 사용하여 조작할 수 있는 객체를 할당.
//     const $companyList = $('.conts_box');
//     // .const_box에 해당하는 Html요소들을 변수에 할당합니다.

//     const companies = [];
//     // 추출한 기업 정보를 저장할 배열을 초기화 합니다.

//     $companyList.filter((idx, node) => {
//       // companyList의 요소를 필터링하고, 각 요소에 대해 작업을 수행

//       const companyId = idx + 1;
//       // 1 부터 추가되도록

//       const email = faker.internet.email();
//       // faker를 통해 가짜 데이터를 생성

//       const password = faker.internet.password();
//       // faker를 통해 가짜 데이터를 생성

//       const introduction = faker.lorem.paragraph();
//       // faker를 통해 가짜 데이터를 생성

//       const title = $(node).find('.jcinfo_logo_cpname em a').text().trim();
//       if (title === '') {
//         return false;
//       }
//       // 기업이름을 추출하고 공백을 제거하여 할당, 이름이 없을 경우 건너 뜀

//       const business =
//         $(node).find("li:contains('업종') .txt em").text().trim() || '기타';

//       const employees =
//         $(node).find("li:contains('기업규모') .txt em").text().trim() || '0';

//       const address =
//         $(node).find("li:contains('주소') .txt em").text().trim() ||
//         '서울시 강남구';

//       const website = $(node)
//         .find("li:contains('홈페이지') .txt a.link_txt")
//         .attr('href');

//       const image = 'http:' + $(node).find('div.jcinfo_logo img').attr('src');

//       // 컴퍼니를 변수에 할당
//       const company = {
//         id: Number(companyId),
//         email,
//         password,
//         title,
//         introduction,
//         business,
//         employees,
//         image,
//         address,
//         website,
//       };

//       // 컴퍼니스에 푸쉬
//       companies.push(company);
//     });
//     console.log('================companies===============', companies);
//     return companies;
//   }

//   // 채용공고 파싱
//   jobParsing(page) {
//     const $ = cheerio.load(page);
//     const $jobList = $('.job_info_detail');
//     const jobs = [];

//     $jobList.each((idx, node) => {
//       // const companyTitle = $(node).find('em a').text().trim();

//       const companyId = idx + 1;
//       // 컴퍼니 아이디를 하나씩 늘리는 것

//       const title =
//         $(node).find('strong').text().replace(/\t/g, '').trim() || '회사 이름';

//       const career =
//         $(node).find('.txt em.bb:eq(1)').text().trim() || '경력 무관';

//       const salary =
//         $(node).find('.txt em:eq(4)').text().trim() || '면접 후 결정';

//       const education =
//         $(node).find('.txt em:eq(3)').text().trim() || '학력 무관';

//       const workType =
//         $(node).find('.txt em.bb:eq(0)').text().trim() || '정규직';

//       const workArea =
//         $(node).find('.txt em:eq(2)').text().trim() || '서울 강남구';

//       const content = faker.lorem.paragraph();

//       const dueDate = faker.date.future();

//       // const $dueDate = $('.fleft');
//       // $dueDate.each((idx, node) => {
//       //   const dueDate = $(node).find('.day:eq(1) em').text().trim();
//       //   jobs[idx].dueDate = dueDate;
//       // });
//       // let dueDate;
//       const jobposting = {
//         companyId: Number(companyId),
//         title,
//         career,
//         salary,
//         education,
//         workType,
//         workArea,
//         content,
//         dueDate,
//       };

//       jobs.push(jobposting);
//     });
//     console.log('================jobs===============', jobs);
//     return jobs;
//   }

//   async inflearnCrawling() {
//     console.time('코드 실행시간');
//     // 코드 실행시간을 구해줌

//     const totalPage = 2; // 크롤링할 페이지 수
//     const jobInfo = [];
//     const companyInfo = [];

//     // 페이지수 만큼 반복문을 돌며 정보를 크롤링
//     // 해당 페이지의 URL을 생성하고, 이를 getPuppeteerData통해 Puppeteer를 통해 가져오기를 사용
//     for (let i = 1; i <= totalPage; i++) {
//       const jobpostingUrl = `https://job.incruit.com/jobdb_list/searchjob.asp?ct=3&ty=1&cd=149&page=${i}`;
//       const jobpostingContent = await this.getPuppeteerData(jobpostingUrl);

//       // Cheerio를 사용하여 페이지의 HTML을 파싱하고, jobLinks선택하여 채용공고의 링크를 제공
//       const $ = cheerio.load(jobpostingContent);
//       const jobLinks = $(
//         "li.c_col .cell_mid .cl_top a[target='_blank']",
//       ).first();

//       // 취업공고 정보를 반복문으로 돌려서 추출
//       for (let j = 0; j < jobLinks.length; j++) {
//         // 채용공고의 링크를 순회해서 상세페이지의 HTML을 가져오고
//         const jobLink = jobLinks[j];
//         const jobDetailUrl = $(jobLink).attr('href');

//         console.log('================jobLinks===============', jobDetailUrl);

//         // jobParsing채용공고 HTML 정보를 추출한 후 companyContent 추가
//         const companyContent = await this.getPuppeteerData(jobDetailUrl);
//         // jobParsing채용공고 HTML 정보를 추출한 후 jobpostings배열에 추가
//         const jobContent = await this.getPuppeteerData(jobDetailUrl);

//         // 회사 파싱 후 companies 변수에 삽입
//         const companies = this.companyParsing(companyContent);
//         // 채용공고 파싱 후 jobs 변수에 삽입
//         const jobs = this.jobParsing(jobContent);

//         companyInfo.push(companies);
//         //각각 회사 정보, 채용정보에 푸쉬
//         jobInfo.push(jobs);

//         // await this.delay(5000); // 각페이지 크롤링 후 5초 대기
//       }
//     }
//     // 코드 실행시간을 측정
//     console.timeEnd('코드 실행시간');

//     // companyEntities에 담을 초기화 배열
//     const companyEntities = [];
//     companyInfo.forEach((company) => {
//       const companyEntity = this.companyRepository.create({
//         // 생성하고
//         id: company.id,
//         email: company.email,
//         password: company.password,
//         title: company.title,
//         introduction: company.introduction,
//         business: company.business,
//         employees: company.employees,
//         image: company.image,
//         website: company.website,
//         address: company.website,
//       });
//       companyEntities.push(companyEntity);
//     });

//     await this.companyRepository.insert(companyEntities); // 회사 DB에 저장한다

//     jobInfo.forEach((job) => {
//       const jobEntity = this.jobpostingRepository.create({
//         // 생성하고
//         companyId: job.companyId,
//         // company: { id: company.id },
//         // companyId: company.id,
//         title: job.title,
//         career: job.career,
//         salary: job.salary,
//         education: job.education,
//         workType: job.workType,
//         workArea: job.workArea,
//         content: job.content,
//         dueDate: job.dueDate,
//       });
//       this.jobpostingRepository.insert(jobEntity); // 채용공고 DB에 저장한다
//     });

//     // 리턴값 보여주기..
//     return { jobInfo, companyInfo };
//   }
//   // private delay(ms: number) {
//   //   return new Promise((resolve) => setTimeout(resolve, ms));
//   // }
// }
