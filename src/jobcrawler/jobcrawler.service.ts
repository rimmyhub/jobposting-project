import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Jobposting } from 'src/domain/jobposting.entity';
import { And, Repository } from 'typeorm';
import cheerio from 'cheerio';
import { Job } from 'src/utils/job.interface';
import { faker } from '@faker-js/faker';
import { Company } from 'src/domain/company.entity';
import * as iconv from 'iconv-lite';
import axios from 'axios';
const fs = require('fs');

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

  // 회사 정보 파싱
  companyParsing(page) {
    const $ = cheerio.load(page);
    const $companyList = $('.conts_box');
    const companies = [];

    $companyList.filter((idx, node) => {
      const companyNameLink = $(node).find('.jcinfo_logo_cpname a');

      const companyIdHtef = companyNameLink.attr('href');
      if (companyIdHtef !== undefined) {
        const trimmedCompanyId = companyIdHtef.trim();
        const companyId = trimmedCompanyId.split('/').pop();

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
          id: Number(companyId),
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
  jobParsing(page, _companyId) {
    const $ = cheerio.load(page);
    const $jobList = $('.c_row');
    const jobs = [];

    const _title = [];
    // const _career = [];
    // const _salary = [];
    // const _education = [];
    // const _workType = [];
    // const _workArea = [];
    // const _jobText = [];
    // const _dueDate = [];

    console.log($jobList.length);
    $jobList.each((idx, node) => {
      const companyLink = $(node).find('.cpname');
      const companyId = Number(companyLink.attr('href').split('/').pop());

      if (companyId !== _companyId) {
        return;
      }

      const title = $(node).find("a[target='_blank']").text() || '인재 구함';
      _title.push(title);

      const career =
        $(node).find('.cl_md > span:eq(0)').text().trim() || '경력 무관';

      const salary =
        $(node).find('.cl_md > span:eq(4)').text().trim() || '회사 내규';

      const education =
        $(node).find('.cl_md > span:eq(1)').text().trim() || '학력 무관';

      const workType =
        $(node).find('.cl_md > span:eq(3)').text().trim() || '정규직';

      const workArea =
        $(node).find('.cl_md > span:eq(2)').text().trim() || '서울 강남구';

      const jobText = $(node).find('.cl_btm > span').text().trim();
      const jobWithoutDate = jobText.replace(/~\d{2}.\d{2}.*?\)/, '').trim();
      const jobWithoutDateAndExtra = jobWithoutDate
        .replace(/\([^)]+\)$/gm, '')
        .trim();
      const job = jobWithoutDateAndExtra || '기타';

      const content = faker.lorem.paragraph();

      const dueDate = $(node)
        .find('.cell_last > .cl_btm > span:eq(0)')
        .text()
        .trim();

      const jobposting = {
        companyId: Number(companyId),
        title: _title[_title.length - 1],
        career,
        salary,
        education,
        job,
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

  async inflearnCrawling() {
    console.time('코드 실행시간');

    const totalPage = 1; // 크롤링할 페이지
    const jobInfo = [];
    const companyInfo = [];

    for (let i = 1; i <= totalPage; i++) {
      const jobpostingUrl = `https://job.incruit.com/jobdb_list/searchjob.asp?ct=3&ty=1&cd=149&page=${i}`;
      const jobpostingContent = await this.getAxiosData(jobpostingUrl);

      const $ = cheerio.load(jobpostingContent);
      const jobLinks = $('li.c_col .cell_mid .cl_top a');

      for (const jobLink of jobLinks) {
        const jobDetailUrl = $(jobLink).attr('href');

        const companyContent = await this.getAxiosData(jobDetailUrl);
        const jobContent = await this.getAxiosData(jobpostingUrl);

        const companies = this.companyParsing(companyContent);
        const jobs = this.jobParsing(jobContent, companies[0].id);

        companyInfo.push(companies);
        jobInfo.push(jobs);

        // await this.delay(10000); // 각페이지 크롤링 후 5초 대기
      }
    }

    let companyId = 0;
    for (const companys of companyInfo) {
      const companyEntity = this.companyRepository.create({
        id: companys[0].id,
        email: companys[0].email,
        password: companys[0].password,
        title: companys[0].title,
        introduction: companys[0].introduction,
        business: companys[0].business,
        employees: companys[0].employees,
        image: companys[0].image,
        website: companys[0].website,
        address: companys[0].address,
      });

      await this.companyRepository.insert(companyEntity);
    }

    let jobId = 0;
    for (const jobs of jobInfo) {
      const jobEntity = this.jobpostingRepository.create({
        companyId: jobs[0].companyId,
        title: jobs[0].title,
        career: jobs[0].career,
        salary: jobs[0].salary,
        education: jobs[0].education,
        job: jobs[0].job,
        workType: jobs[0].workType,
        workArea: jobs[0].workArea,
        content: jobs[0].content,
        dueDate: jobs[0].dueDate,
      });
      this.jobpostingRepository.insert(jobEntity);
    }

    return { jobInfo, companyInfo };
  }
  // private delay(ms: number) {
  //   return new Promise((resolve) => setTimeout(resolve, ms));
  // }
}
