import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Jobposting } from 'src/domain/jobposting.entity';
import { Repository } from 'typeorm';
import cheerio from 'cheerio';
import { Job } from 'src/utils/job.interface';
import { faker } from '@faker-js/faker';
import { Company } from 'src/domain/company.entity';
import * as iconv from 'iconv-lite';
import axios from 'axios';
import { v5 as uuidv5, NIL as NIL_UUID } from 'uuid';
import { timeEnd } from 'console';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class JobcrawlerService {
  constructor(
    @InjectRepository(Jobposting)
    private readonly jobpostingRepository: Repository<Jobposting>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  private async getAxiosData(url: string): Promise<string> {
    try {
      const response = await axios.get(url, { responseType: 'arraybuffer' });

      const decodedHtml = iconv.decode(Buffer.from(response.data), 'EUC-KR');
      return decodedHtml;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // 직무 정보 파싱
  taskParsing(page) {
    const $ = cheerio.load(page);
    const $jobList = $('.c_row');
    const tasks = [];
    $jobList.each((idx, node) => {
      const taskText = $(node).find('.cl_btm > span').text().trim();
      const taskWithoutDate = taskText.replace(/~\d{2}.\d{2}.*?\)/, '').trim();
      const taskWithoutDateAndExtra = taskWithoutDate
        .replace(/\([^)]+\)$/gm, '')
        .trim();
      const task = taskWithoutDateAndExtra || '기타';
      tasks.push(task);
    });

    return tasks;
  }

  // 회사 정보 파싱
  companyParsing(page) {
    const $ = cheerio.load(page);
    const $companyList = $('.conts_box');
    const companies = [];

    $companyList.filter((idx, node) => {
      const companyNameLink = $(node).find('.jcinfo_logo_cpname a');
      const companyUrl = companyNameLink.attr('href');
      if (companyUrl !== undefined) {
        const trimmedCompanyId = companyUrl.trim();

        const companyId = uuidv5(trimmedCompanyId, NIL_UUID);
        // const companyId = trimmedCompanyId.split('/').pop();

        const email = faker.internet.email();

        const password = faker.internet.password();

        const introduction = faker.lorem.paragraph();

        const title = $(node).find('.jcinfo_logo_cpname em a').text().trim();
        if (title === '') {
          return false;
        }

        const business =
          $(node).find("li:contains('업종') .txt em").text().trim() || '기타';

        const employees =
          $(node).find("li:contains('기업규모') .txt em").text().trim() || '0';

        const address =
          $(node).find("li:contains('주소') .txt em").text().trim() ||
          '서울시 강남구';

        const website =
          $(node)
            .find("li:contains('홈페이지') .txt a.link_txt")
            .attr('href') || '';

        const image =
          'http:' + $(node).find('div.jcinfo_logo img').attr('src') || '';

        const company = {
          id: companyId,
          email,
          password,
          title,
          introduction,
          business,
          employees,
          image,
          address,
          website,
        };
        companies.push(company);
      }
    });
    // console.log('================companies===============', companies);
    return companies;
  }

  // 채용공고 파싱
  jobParsing(page, task) {
    const $ = cheerio.load(page);
    const $jobList = $('.job_info_detail');
    const jobs = [];

    $jobList.each((idx, node) => {
      const companyIdLink = $(node).find('em a');
      const companyUrl = companyIdLink.attr('href');

      const companyId = uuidv5(companyUrl, NIL_UUID);

      const title =
        $(node)
          .find('strong')
          .text()
          .replace(/\t/g, '')
          .replace(/D-\d+/, '')
          .trim() || '회사 이름';

      const career =
        $(node).find('.txt em.bb:eq(1)').text().trim() || '경력 무관';
      const salary =
        $(node).find('.txt em:eq(4)').text().trim() || '면접 후 결정';

      const education =
        $(node).find('.txt em:eq(3)').text().trim() || '학력 무관';

      const workType =
        $(node).find('.txt em.bb:eq(0)').text().trim() || '정규직';

      const workArea =
        $(node).find('.txt em:eq(2)').text().trim() || '서울 강남구';

      const content = faker.lorem.paragraph();

      let dueDate;

      const $dueDate = $('.fleft');
      $dueDate.each((idx, node) => {
        dueDate = $(node).find('.day:eq(1) em').text().trim() || '상시 채용';
      });

      const jobposting = {
        companyId,
        job: task,
        title,
        career,
        salary,
        education,
        workType,
        workArea,
        content,
        dueDate,
      };

      jobs.push(jobposting);
    });
    // console.log('================jobs===============', jobs);
    return jobs;
  }

  @Cron('0 8 * * *') // 매일 오전 8시에 실행
  async incruitCrawling() {
    console.time('코드 실행시간');
    // 코드 실행시간을 구해줌

    const totalPage = 1; // 크롤링할 갯수
    const jobInfo = [];
    const companyInfo = [];

    for (let i = 1; i <= totalPage; i++) {
      const jobpostingUrl = `https://job.incruit.com/jobdb_list/searchjob.asp?ct=3&ty=1&cd=149&page=${i}`;
      const jobpostingContent = await this.getAxiosData(jobpostingUrl);
      const $ = cheerio.load(jobpostingContent);

      const tasksContent = await this.getAxiosData(jobpostingUrl);
      const tasks = this.taskParsing(tasksContent);

      const jobLinks = $('li.c_col .cell_mid .cl_top a');
      let count = 0;
      for (const jobLink of jobLinks) {
        const jobDetailUrl = $(jobLink).attr('href');

        const companyContent = await this.getAxiosData(jobDetailUrl);

        const jobContent = await this.getAxiosData(jobDetailUrl);

        const companies = this.companyParsing(companyContent);

        const jobs = this.jobParsing(jobContent, tasks[count]);
        companyInfo.push(companies);
        jobInfo.push(jobs);
        count++;

        await this.delay(1000); // 각페이지 크롤링 후 1초 대기
      }
    }
    // 코드 실행시간을 측정
    console.log(timeEnd);

    console.log('===========companyInfo===========', companyInfo);
    console.log('==========jobInfo================', jobInfo);
    // companyEntities에 담을 초기화 배열

    for (const companys of companyInfo) {
      for (const company of companys) {
        const companyEntity = this.companyRepository.create({
          id: company.id,
          email: company.email,
          password: company.password,
          title: company.title,
          introduction: company.introduction,
          business: company.business,
          employees: company.employees,
          image: company.image,
          website: company.website,
          address: company.address,
        });
        const isExist = await this.companyRepository.findOne({
          where: { id: company.id },
        });
        if (!isExist) {
          await this.companyRepository.insert(companyEntity);
        }
      }
    }

    for (const jobs of jobInfo) {
      for (const job of jobs) {
        const jobEntity = this.jobpostingRepository.create({
          companyId: job.companyId,
          company: { id: job.companyId },
          title: job.title,
          career: job.career,
          salary: job.salary,
          education: job.education,
          job: job.job,
          workType: job.workType,
          workArea: job.workArea,
          content: job.content,
          dueDate: job.dueDate,
        });
        this.jobpostingRepository.insert(jobEntity);
      }
    }

    return { jobInfo, companyInfo };
  }
  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
