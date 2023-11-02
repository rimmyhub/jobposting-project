import { CreateJobpostingDto } from './dto/create-jobposting.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, In, IsNull, LessThan, Like, Not, Repository } from 'typeorm';
import { UpdateJobpostingDto } from './dto/update-jobposting.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Jobposting } from '../domain/jobposting.entity';
import { Company } from '../domain/company.entity';

export class JobpostingService {
  constructor(
    @InjectRepository(Jobposting)
    private readonly jobpostingRepository: Repository<Jobposting>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  // 채용공고 아이디 가져오기
  async getJobpostingId({ id }: { id: number }) {
    const jobposting = await this.jobpostingRepository.findOne({
      where: { id },
    }); // 쿼리 조건을 추가하여 원하는 jobposting 가져옴

    if (!jobposting) {
      throw new Error('채용공고를 찾을 수 없습니다.');
    }

    return jobposting.id; // jobposting의 id 속성 반환
  }

  // 회사별 채용공고 생성 (회사 연결)
  async createJobposting(
    companyId: string,
    createJobpostingDto: CreateJobpostingDto,
  ): Promise<Jobposting> {
    const existingCompany = await this.companyRepository.findOne({
      where: { id: companyId },
    });

    if (!existingCompany) {
      throw new HttpException(
        '회사를 찾을 수 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const jobposting = await this.jobpostingRepository.save({
      companyId,
      ...createJobpostingDto,
    });
    return jobposting;
  }

  // 채용공고 전체 조회
  async findAllJobposting({ pageReqDto }): Promise<Jobposting[]> {
    const { page, size } = pageReqDto;
    const jobpostings = await this.jobpostingRepository.find({
      order: { createdAt: 'DESC' },
      take: size,
      skip: (page - 1) * size,
    });
    return jobpostings;
  }

  // 회사별 채용공고 전체 조회
  async findCompanyAllJobposting(id: string): Promise<Jobposting[]> {
    return await this.jobpostingRepository.find({ where: { companyId: id } });
  }

  // 회사별 채용공고 전체 조회 (소프트 딜리트된 데이터만 조회)
  async findCompanyAllJobpostingDelete(id: string): Promise<Jobposting[]> {
    return await this.jobpostingRepository.find({
      where: { companyId: id, deletedAt: Not(IsNull()) },
      withDeleted: true,
    });
  }

  // 특정 회사 ID를 기준으로 해당 companyId를 가진 모든 채용 공고 조회
  async findJobpostingsByCompanyId(companyId: string): Promise<Jobposting[]> {
    const jobposting = await this.jobpostingRepository.find({
      where: { companyId },
    });

    return jobposting;
  }

  // 윤영 : 검색시 해당 검색어를 포함하는 채용 공고글 전체 조회
  async searchKeyword(keyword: string) {
    console.time('jobposting');
    const jobPostings = await this.jobpostingRepository
      .createQueryBuilder('jobposting')
      .select([
        'jobposting.id',
        'jobposting.title',
        'jobposting.workArea',
        'jobposting.dueDate',
      ])
      .where('jobposting.title LIKE :title OR jobposting.job LIKE :title', {
        title: `%${keyword}%`,
      })
      .getMany();

    if (jobPostings.length === 0) {
      throw new HttpException(
        '검색 결과가 존재하지 않습니다.',
        HttpStatus.NOT_FOUND,
      );
    }
    console.timeEnd('jobposting');
    return jobPostings;
  }

  // 윤영 : 옵션설정시 해당 옵션을 포함하는 채용공고글 전체 조회
  async searchOption(occupation: string, workArea: string, experience: string) {
    const queryBuilder =
      this.jobpostingRepository.createQueryBuilder('jobposting');

    // 3가지 옵션이 "전체"값일 때 예외처리
    if (
      occupation === '직군 전체' &&
      workArea === '지역 전국' &&
      experience === '경력 전체'
    ) {
      const resData = await queryBuilder.getMany();
      // 예외처리
      if (resData.length === 0) {
        throw new HttpException(
          '선택 옵션에 해당하는 채용 공고가 없습니다.',
          HttpStatus.GONE,
        );
      }
      // 반환값
      return resData;
    }

    // 직군 설정
    if (occupation !== '직군 전체') {
      const occupations = occupation.split('·');

      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where(
            'jobposting.job LIKE :job OR jobposting.job LIKE :job1 OR jobposting.job LIKE :job2',
            {
              job: `%${occupations[0]}%`,
              job1: `%${occupations[1]}%`,
              job2: `%${occupations[2]}%`,
            },
          );
        }),
      );
    }

    // 지역 설정
    if (workArea !== '지역 전국') {
      queryBuilder.andWhere('jobposting.workArea LIKE :workArea', {
        workArea: `%${workArea}%`,
      });
    }

    // 경력 설정
    if (experience !== '경력 전체') {
      queryBuilder.andWhere('jobposting.career LIKE :experience', {
        experience: `%${experience}%`,
      });
    }

    // 반환값
    const resData = await queryBuilder.getMany();
    // 예외처리
    if (resData.length === 0) {
      throw new HttpException(
        '선택 옵션에 해당하는 채용 공고가 없습니다.',
        HttpStatus.GONE,
      );
    }
    // 반환값
    return resData;
  }

  // 윤영 : 메인페이지에서 채용공고 클릭 시 해당 채용공고 내용 조회
  async getJobposting(jobpostingId: number) {
    const jobposting = await this.jobpostingRepository.findOne({
      where: { id: jobpostingId },
      relations: ['company'], // 채용공고 정보를 함께 가져오기 위해 관계 설정
    });
    return jobposting;
  }

  // 채용공고 1개 조회
  async findOneJobposting(
    companyId: string,
    jobpostingId: number,
  ): Promise<Jobposting> {
    // 회사 아이디가 있는지 확인
    const existingCompany = await this.jobpostingRepository.findOne({
      where: { companyId },
    });

    // 해당 id가 있는 채용 공고 있는지 확인
    const existingJobposting = await this.jobpostingRepository.findOne({
      where: { id: jobpostingId },
    });

    // 회사와 채용공고 id가 없으면 예외
    if (!existingCompany || !existingJobposting) {
      throw new HttpException(
        '채용 공고를 찾을 수 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const jobposting = await this.jobpostingRepository.findOne({
      where: { companyId, id: jobpostingId },
    });
    return jobposting;
  }

  // 채용공고 수정
  async updateJobposting(
    jobpostingId: number,
    id: string,
    updateJobpostingDto: UpdateJobpostingDto,
  ) {
    const jobposting = await this.jobpostingRepository.findOne({
      where: { id: jobpostingId },
    });

    if (!jobposting) {
      throw new HttpException(
        '채용 공고를 찾을 수 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // console.log(jobposting.companyId);
    // console.log(id);
    // 로그인된 회사 ID와 채용공고의 회사 ID 비교
    if (jobposting.companyId !== id) {
      throw new HttpException('권한이 없습니다.', HttpStatus.FORBIDDEN);
    }

    Object.assign(jobposting, id, updateJobpostingDto);
    return await this.jobpostingRepository.save(jobposting);
  }

  // 채용공고 삭제
  @Cron('0 0 * * *') // 매일 자정에 실행
  async removeJobposting(jobpostingId: number, id: string) {
    const jobposting = await this.jobpostingRepository.findOne({
      where: { id: jobpostingId },
    });
    if (!jobposting) {
      throw new HttpException(
        '채용 공고를 찾을 수 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // 로그인된 회사 ID와 채용공고의 회사 ID 비교
    if (jobposting.companyId !== id) {
      throw new HttpException('권한이 없습니다.', HttpStatus.FORBIDDEN);
    }
    const currentDate = new Date(); // 현재 날짜
    const threeMonthsAgo = new Date(); // 석달 전
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 1); // 1달전이전의 데이터
    // threeMonthsAgo.setMinutes(threeMonthsAgo.getMinutes() - 10); // 10분전 데이터 (테스트용)

    // 현재 시간보다 이전의 채용마감일을 가진 공고를 찾아 소프트 딜리트하기
    const expiredJobpostings = await this.jobpostingRepository.find({
      where: { dueDate: LessThan(currentDate) },
      //이 옵션은 특정 값보다 작은 값을 가진 레코드를 조회할 때 사용. 예를 들어, LessThan(currentDate)는 현재 날짜보다 이전의 날짜를 가진 레코드를 조회
    });

    // 만료된(expiredJobpostings)걸 가지고 소프트 리무브
    for (const jobposting of expiredJobpostings) {
      await this.jobpostingRepository.softRemove(jobposting);
    }

    // 소프트 리무브로 삭제한 뒤 일정 시간(1개월)이 지난 후 완전히 삭제하기
    const oldJobpostings = await this.jobpostingRepository.find({
      where: { deletedAt: LessThan(threeMonthsAgo) },
      withDeleted: true, //TypeORM은 소프트 딜리트된 레코드를 제외하고 데이터를 조회. 그러나 withDeleted: true 옵션을 사용하면 소프트 딜리트된 레코드도 조회 결과에 포함
    });

    for (const jobposting of oldJobpostings) {
      await this.jobpostingRepository.remove(jobposting);
    }
  }

  // return await this.jobpostingRepository.remove(jobposting); 기존 코드
}

// // 옵션 설정 빈 배열
// let selectOption = {};

// // 3가지 옵션이 "전체"값일 때 예외처리
// if (
//   occupation === '직군 전체' &&
//   workArea === '지역 전국' &&
//   experience === '경력 전체'
// ) {
//   const resData = await this.jobpostingRepository.find();
//   // 예외처리
//   if (resData.length === 0) {
//     throw new HttpException(
//       '선택옵션에 해당하는 채용공고가 없습니다.',
//       HttpStatus.GONE,
//     );
//   }
//   // 반환값
//   return resData;
// }
// let arr = [];
// // 직군 설정
// const occupations = occupation.split('·'); // 디자인, 마케팅, 광고
// // const jobFilters = occupations.map((occ) => ({
// //   job: Like(`%${occ}%`),
// // }));
// occupations.forEach((occ) => {
//   arr.push({ job: Like(`%${occ}%`) });
// });
// console.log(arr);
// // console.log(jobFilters); // [{{디자인} {마케팅} {광고}}]
// // const job = (jobFilters[0].job, jobFilters[1].job, jobFilters[2].job);
// // console.log(job); // [{디자인} {마케팅} {광고}]
// selectOption['job'] = arr;

// // 지역 설정
// if (workArea !== '지역 전국') {
//   selectOption['workArea'] = Like(`%${workArea}%`);
// }

// // 경력 설정
// if (experience !== '경력 전체') {
//   selectOption['career'] = Like(`%${experience}%`);
// }

// console.log(selectOption); // { job: [ {undefined}, {undefined}, {undefined} ]

// // 옵션 적용
// const searchOptions = { where: selectOption };
// console.log(searchOptions); // { where: { job: [ [Object], [Object], [Object] ] } }
// // 반환값
// const resData = await this.jobpostingRepository.find(searchOptions);
// // 예외처리
// if (resData.length === 0) {
//   throw new HttpException(
//     '선택옵션에 해당하는 채용공고가 없습니다.',
//     HttpStatus.GONE,
//   );
// }
// // 반환값
// return resData;

// queryBuilder.andWhere(
//   'jobposting.job LIKE :job OR jobposting.job LIKE :job1 OR jobposting.job LIKE :job2',
//   {
//     job: `%${occupations[0]}%`,
//     job1: `%${occupations[1]}%`,
//     job2: `%${occupations[2]}%`,
//   },
// );
