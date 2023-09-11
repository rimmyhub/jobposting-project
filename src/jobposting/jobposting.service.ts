import { CreateJobpostingDto } from './dto/create-jobposting.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Jobposting } from 'src/domain/jobposting.entity';
import { LessThan, Like, Repository } from 'typeorm';
import { UpdateJobpostingDto } from './dto/update-jobposting.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Company } from 'src/domain/company.entity';
import { Cron } from '@nestjs/schedule';

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

    console.log(jobposting);
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
    // 회사에 아이디가 생성되있는지 찾기
    try {
      const existingCompany = await this.companyRepository.findOne({
        where: { id: companyId },
      });
      console.log('existingCompany', existingCompany);
      // 데이터베이스에 회사가 생성되어있는지 확인
      if (!existingCompany) {
        throw new HttpException(
          '회사를 찾을 수 없습니다.',
          HttpStatus.BAD_REQUEST,
        );
      }

      // // 로그인된 회사 ID와 채용공고의 회사 ID 비교
      // if (companyId !== id) {
      //   throw new HttpException('권한이 없습니다.', HttpStatus.FORBIDDEN);
      // }

      const {
        title,
        career,
        salary,
        education,
        job,
        workType,
        workArea,
        content,
        dueDate,
      } = createJobpostingDto;

      console.log(companyId);

      console.log('hi');

      const jobposting = await this.jobpostingRepository.create({
        companyId,
        title,
        career,
        salary,
        education,
        job,
        workType,
        workArea,
        content,
        dueDate,
      });

      console.log(jobposting);

      console.log('hi');

      await this.jobpostingRepository.save(jobposting);
      return jobposting;
    } catch (error) {
      console.error();
    }
  }

  // 채용공고 전체 조회
  async findAllJobposting({ page }) {
    return await this.jobpostingRepository.find({
      take: 20,
      skip: (page - 1) * 20,
      order: { createdAt: 'DESC' },
    });
  }

  // // 회사별 채용공고 전체 조회
  // async findCompanyAllJobposting(companyId: number): Promise<Jobposting[]> {
  //   const existingCompany = await this.jobpostingRepository.findOne({
  //     where: { companyId },
  //   });

  //   if (!existingCompany) {
  //     throw new HttpException(
  //       '채용공고를 찾을 수 없습니다.',
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }

  //   return await this.jobpostingRepository.find({ where: { companyId } });
  // }

  // 회사별 채용공고 전체 조회
  async findCompanyAllJobposting(id: string): Promise<Jobposting[]> {
    return await this.jobpostingRepository.find({ where: { companyId: id } });
  }

  // 윤영 : 검색시 해당 검색어를 포함하는 채용 공고글 전체 조회
  async searchKeyword(keyword: string) {
    if (!keyword) {
      throw new HttpException(
        '검색어를 입력해주세요',
        HttpStatus.I_AM_A_TEAPOT,
      );
    }

    const jobPostings = await this.jobpostingRepository
      .createQueryBuilder('jobposting')
      .select([
        'jobposting.id',
        'jobposting.title',
        'jobposting.workArea',
        'jobposting.dueDate',
      ])
      .where('jobposting.title LIKE :title', { title: `%${keyword}%` })
      .getMany();

    if (jobPostings.length === 0) {
      throw new HttpException(
        '검색 결과가 존재하지 않습니다.',
        HttpStatus.NOT_FOUND,
      );
    }

    return jobPostings;
  }

  // 윤영 : 직군 선택시 채용공고 직군과 일치한 회사 전체 조회
  async searchOccupation(job: string) {
    if (job === '직군 전체') {
      return await this.jobpostingRepository.find();
    }
    const splitJob = job.split('·');

    const splitData = await this.jobpostingRepository.find({
      where: [
        { job: Like(`%${splitJob[0]}%`) },
        { job: Like(`%${splitJob[1]}%`) },
        { job: Like(`%${splitJob[2]}%`) },
      ],
    });
    if (splitData.length === 0) {
      throw new HttpException(
        '검색결과가 존재하지 않습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
    return splitData;
  }

  // 윤영 : 지역 + 경력 일치하는 채용 공고글 전체 조회
  async searchSelectJobposting(career: string, workArea: string) {
    // 모든 지역 + 경력 옵션
    if (workArea === '지역 전국' && career === '경력 전체') {
      return this.jobpostingRepository.find();
    }
    // 지역전국 옵션
    if (workArea === '지역 전국') {
      return await this.jobpostingRepository.find({
        where: {
          career: Like(`%${career}%`),
        },
      });
    }
    // 경력전체 옵션
    if (career === '경력 전체') {
      if (workArea === '충청') {
        const resData = await this.jobpostingRepository.find({
          where: [
            { workArea: Like(`%충북%`) },
            { workArea: Like(`%충남%`) },
            { workArea: Like(`%대전%`) },
            { workArea: Like(`%세종%`) },
          ],
        });

        if (resData.length === 0) {
          throw new HttpException(
            '지역에 해당하는 채용공고가 없습니다.',
            HttpStatus.GONE,
          );
        }

        return resData;
      }
      if (workArea === '전라') {
        const resData = await this.jobpostingRepository.find({
          where: [
            { workArea: Like(`%전북%`) },
            { workArea: Like(`%전남%`) },
            { workArea: Like(`%광주%`) },
          ],
        });

        if (resData.length === 0) {
          throw new HttpException(
            '지역에 해당하는 채용공고가 없습니다.',
            HttpStatus.GONE,
          );
        }

        return resData;
      }
      if (workArea === '경상') {
        const resData = await this.jobpostingRepository.find({
          where: [
            { workArea: Like(`%경북%`) },
            { workArea: Like(`%경남%`) },
            { workArea: Like(`%대구%`) },
            { workArea: Like(`%울산%`) },
            { workArea: Like(`%부산%`) },
          ],
        });

        if (resData.length === 0) {
          throw new HttpException(
            '지역에 해당하는 채용공고가 없습니다.',
            HttpStatus.GONE,
          );
        }

        return resData;
      }

      const resData = await this.jobpostingRepository.find({
        where: { workArea: Like(`%${workArea}%`) },
      });

      if (resData.length === 0) {
        throw new HttpException(
          '지역에 해당하는 채용공고가 없습니다.',
          HttpStatus.GONE,
        );
      }

      return resData;
    }
    // 충청도 옵션
    if (workArea === '충청') {
      if (career === '경력 전체') {
        const resData = await this.jobpostingRepository.find({
          where: [
            { workArea: Like(`%충북%`) },
            { workArea: Like(`%충남%`) },
            { workArea: Like(`%대전%`) },
            { workArea: Like(`%세종%`) },
          ],
        });

        if (resData.length === 0) {
          throw new HttpException(
            '지역에 해당하는 채용공고가 없습니다.',
            HttpStatus.GONE,
          );
        }

        return resData;
      }

      const resData = await this.jobpostingRepository.find({
        where: [
          { workArea: Like(`%충남%`), career: Like(`%${career}%`) },
          { workArea: Like(`%충북%`), career: Like(`%${career}%`) },
          { workArea: Like(`%대전%`), career: Like(`%${career}%`) },
          { workArea: Like(`%세종%`), career: Like(`%${career}%`) },
        ],
      });

      if (resData.length === 0) {
        throw new HttpException(
          '지역에 해당하는 채용공고가 없습니다.',
          HttpStatus.GONE,
        );
      }

      return resData;
    }
    // 전라도 옵션
    if (workArea === '전라') {
      if (career === '경력 전체') {
        const resData = await this.jobpostingRepository.find({
          where: [
            { workArea: Like(`%전북%`) },
            { workArea: Like(`%전남%`) },
            { workArea: Like(`%광주%`) },
          ],
        });

        if (resData.length === 0) {
          throw new HttpException(
            '지역에 해당하는 채용공고가 없습니다.',
            HttpStatus.GONE,
          );
        }

        return resData;
      }
      const resData = await this.jobpostingRepository.find({
        where: [
          { workArea: Like(`%전북%`), career: Like(`%${career}%`) },
          { workArea: Like(`%전남%`), career: Like(`%${career}%`) },
          { workArea: Like(`%광주%`), career: Like(`%${career}%`) },
        ],
      });

      if (resData.length === 0) {
        throw new HttpException(
          '지역에 해당하는 채용공고가 없습니다.',
          HttpStatus.GONE,
        );
      }

      return resData;
    }
    // 경상도 옵션
    if (workArea === '경상') {
      if (career === '경력 전체') {
        const resData = await this.jobpostingRepository.find({
          where: [
            { workArea: Like(`%경북%`) },
            { workArea: Like(`%경남%`) },
            { workArea: Like(`%대구%`) },
            { workArea: Like(`%울산%`) },
            { workArea: Like(`%부산%`) },
          ],
        });

        if (resData.length === 0) {
          throw new HttpException(
            '지역에 해당하는 채용공고가 없습니다.',
            HttpStatus.GONE,
          );
        }

        return resData;
      }
      const resData = await this.jobpostingRepository.find({
        where: [
          { workArea: Like(`%경북%`), career: Like(`%${career}%`) },
          { workArea: Like(`%경남%`), career: Like(`%${career}%`) },
          { workArea: Like(`%대구%`), career: Like(`%${career}%`) },
          { workArea: Like(`%울산%`), career: Like(`%${career}%`) },
          { workArea: Like(`%부산%`), career: Like(`%${career}%`) },
        ],
      });

      if (resData.length === 0) {
        throw new HttpException(
          '지역에 해당하는 채용공고가 없습니다.',
          HttpStatus.GONE,
        );
      }

      return resData;
    }
    // 리턴값
    const resData = await this.jobpostingRepository.find({
      where: { workArea: Like(`%${workArea}%`), career: Like(`%${career}%`) },
    });

    if (resData.length === 0) {
      throw new HttpException(
        '지역에 해당하는 채용공고가 없습니다.',
        HttpStatus.GONE,
      );
    }

    return resData;
  }

  // // 윤영 : 지역검색시 해당지역과 일치하는 채용 공고글 전체 조회
  // async searchRegion(workArea: string) {
  //   if (workArea === '지역 전국') {
  //     return await this.jobpostingRepository.find({});
  //   }
  //   if (workArea === '충청') {
  //     return await this.jobpostingRepository.find({
  //       where: [
  //         { workArea: Like(`%충남%`) },
  //         { workArea: Like(`%충북%`) },
  //         { workArea: Like(`%대전%`) },
  //         { workArea: Like(`%세종%`) },
  //       ],
  //     });
  //   }
  //   if (workArea === '전라') {
  //     return await this.jobpostingRepository.find({
  //       where: [
  //         { workArea: Like(`%전북%`) },
  //         { workArea: Like(`%전남%`) },
  //         { workArea: Like(`%광주%`) },
  //       ],
  //     });
  //   }
  //   if (workArea === '경상') {
  //     return await this.jobpostingRepository.find({
  //       where: [
  //         { workArea: Like(`%경북%`) },
  //         { workArea: Like(`%경남%`) },
  //         { workArea: Like(`%대구%`) },
  //         { workArea: Like(`%울산%`) },
  //         { workArea: Like(`%부산%`) },
  //       ],
  //     });
  //   }
  //   return await this.jobpostingRepository.find({
  //     where: { workArea: Like(`%${workArea}%`) },
  //   });
  // }

  // // 윤영 : 경력검색시 해당경력과 일치하는 채용 공고글 전체 조회
  // async searchCareer(career: string) {
  //   if (career === '경력 전체') {
  //     return await this.jobpostingRepository.find({});
  //   }
  //   return await this.jobpostingRepository.find({
  //     where: { career: Like(`%${career}%`) },
  //   });
  // }

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

  // 채용공고 삭제, 진행중
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

    const currentTime = new Date();
    const jobpostings = await this.jobpostingRepository.find({
      withDeleted: true, // 소프트 삭제된 항목도 검색
      where: { dueDate: LessThan(currentTime) }, // 현재 시간보다 이전의 채용 마감일을 가진 공고 찾기
    });

    for (const jobposting of jobpostings) {
      return this.jobpostingRepository.remove(jobposting);
    }
  }
}
