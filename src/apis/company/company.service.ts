import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from '../domain/company.entity';
import {
  Brackets,
  In,
  IsNull,
  LessThanOrEqual,
  Like,
  Not,
  Repository,
} from 'typeorm';
import { CreateCompanyDto } from './dto/create-company.dto';
import * as bcrypt from 'bcrypt';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Cron } from '@nestjs/schedule';
import { Console } from 'console';

@Injectable()
export class CompanyService {
  private readonly logger = new Logger(CompanyService.name); // Logger 초기화
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  // getUserRefTokenMatch
  async getCompanyRefTokenMatch(
    refreToken: string,
    id: string,
  ): Promise<Company> {
    const company: Company = await this.companyRepository.findOne({
      select: {
        email: true,
        currentRefreshToken: true,
        currentRefreshTokenExp: true,
      },
      where: { id: id },
    });

    // 유저 테이블 내에 정의된 암호화된 refresh_token값과
    // 요청 시 body에 담아준 refresh_token값 비교
    const isRefTokenMatch = await bcrypt.compare(
      refreToken,
      company.currentRefreshToken,
    );
    if (isRefTokenMatch) {
      return company;
    }
  }
  // 회사 생성 + 회사 회원가입
  async createCompany(createCompanyDto: CreateCompanyDto) {
    const {
      email,
      title,
      password,
      introduction,
      website,
      address,
      business,
      employees,
      image,
      isVerified,
    } = createCompanyDto;

    const hashedPassword = await bcrypt.hash(password, 10);
    if (isVerified !== true) {
      throw new HttpException(
        '이메일 인증을 진행해주세요!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newCompany = await this.companyRepository.save({
      email,
      title,
      password: hashedPassword,
      introduction,
      website,
      address,
      business,
      employees,
      image,
      isVerified,
    });
    return newCompany;
  }

  // 회사 전체 조회
  async findAllCompany({ pageReqDto }) {
    const { page, size } = pageReqDto;
    const companies = await this.companyRepository.findAndCount({
      order: { createdAt: 'DESC' },
      take: size,
      skip: (page - 1) * size,
    });
    return companies;
  }

  // 모든 회사의 주소 정보만 가져오기
  async getAllCompanyAddresses() {
    const companies = await this.companyRepository.find();
    return companies.map((company) => ({
      title: company.address,
    }));
  }

  // 윤영 : 검색시 업무 또는 회사 이름에 해당 검색어를 포함하는 회사 전체 조회
  async searchKeyword(keyword: string) {
    console.time('company');
    const searchCompanies = await this.companyRepository
      .createQueryBuilder('company')
      .select([
        'company.id',
        'company.title',
        'company.image',
        'company.business',
        'company.employees',
      ])
      .where('company.title LIKE :title OR company.business LIKE :title', {
        title: `%${keyword}%`,
      })
      .getMany();

    if (searchCompanies.length === 0) {
      throw new HttpException(
        '검색 결과가 존재하지 않습니다.',
        HttpStatus.NOT_FOUND,
      );
    }
    console.timeEnd('company');
    return searchCompanies;
  }

  // 윤영 : 옵션설정시 해당 옵션을 포함하는 채용공고글 전체 조회
  async searchOption(occupation: string, workArea: string) {
    const queryBuilder = this.companyRepository.createQueryBuilder('company');

    // 3가지 옵션이 "전체"값일 때 예외처리
    if (occupation === '직군 전체' && workArea === '지역 전국') {
      const resData = await queryBuilder.getMany();
      // 예외처리
      if (resData.length === 0) {
        throw new HttpException(
          '선택 옵션에 해당하는 회사가 없습니다.',
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
            'company.business LIKE :business OR company.business LIKE :business1 OR company.business LIKE :business2',
            {
              business: `%${occupations[0]}%`,
              business1: `%${occupations[1]}%`,
              business2: `%${occupations[2]}%`,
            },
          );
        }),
      );
    }

    // 지역 설정
    if (workArea !== '지역 전국') {
      queryBuilder.andWhere('company.address LIKE :workArea', {
        workArea: `%${workArea}%`,
      });
    }

    // 반환값
    const resData = await queryBuilder.getMany();
    // 예외처리
    if (resData.length === 0) {
      throw new HttpException(
        '선택 옵션에 해당하는 회사가 없습니다.',
        HttpStatus.GONE,
      );
    }
    // 반환값
    return resData;
  }

  // 윤영 : 직군 선택시 회사 사업과 일치한 회사 전체 조회
  async searchOccupation(business: string) {
    if (business === '직군 전체') {
      return await this.companyRepository.find();
    }
    const splitBusiness = business.split('·');

    const splitData = await this.companyRepository.find({
      where: [
        { business: Like(`%${splitBusiness[0]}%`) },
        { business: Like(`%${splitBusiness[1]}%`) },
        { business: Like(`%${splitBusiness[2]}%`) },
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

  // 윤영 : 지역별 회사 전체 조회
  async searchSelectCompany(address: string) {
    // 모든 지역
    if (address === '지역 전국') {
      return this.companyRepository.find();
    }
    if (address === '충청') {
      const resData = await this.companyRepository.find({
        where: [
          { address: Like(`%충북%`) },
          { address: Like(`%충남%`) },
          { address: Like(`%대전%`) },
          { address: Like(`%세종%`) },
        ],
      });

      if (resData.length === 0) {
        throw new HttpException(
          '지역에 해당하는 회사가 없습니다.',
          HttpStatus.GONE,
        );
      }

      return resData;
    }
    if (address === '전라') {
      const resData = await this.companyRepository.find({
        where: [
          { address: Like(`%전북%`) },
          { address: Like(`%전남%`) },
          { address: Like(`%광주%`) },
        ],
      });

      if (resData.length === 0) {
        throw new HttpException(
          '지역에 해당하는 회사가 없습니다.',
          HttpStatus.GONE,
        );
      }

      return resData;
    }
    if (address === '경상') {
      const resData = await this.companyRepository.find({
        where: [
          { address: Like(`%경북%`) },
          { address: Like(`%경남%`) },
          { address: Like(`%대구%`) },
          { address: Like(`%울산%`) },
          { address: Like(`%부산%`) },
        ],
      });

      if (resData.length === 0) {
        throw new HttpException(
          '지역에 해당하는 회사가 없습니다.',
          HttpStatus.GONE,
        );
      }

      return resData;
    }
    // // 충청도 옵션
    // if (address === '충청') {
    //   return await this.companyRepository.find({
    //     where: [
    //       { address: Like(`%충남%`) },
    //       { address: Like(`%충북%`) },
    //       { address: Like(`%대전%`) },
    //       { address: Like(`%세종%`) },
    //     ],
    //   });
    // }
    // return await this.companyRepository.find({
    //   where: [
    //     { address: Like(`%충남%`) },
    //     { address: Like(`%충북%`) },
    //     { address: Like(`%대전%`) },
    //     { address: Like(`%세종%`) },
    //   ],
    // });
    // // 전라도 옵션
    // if (address === '전라') {
    //   return await this.companyRepository.find({
    //     where: [
    //       { address: Like(`%전북%`) },
    //       { address: Like(`%전남%`) },
    //       { address: Like(`%광주%`) },
    //     ],
    //   });
    // }
    // return await this.companyRepository.find({
    //   where: [
    //     { address: Like(`%전북%`) },
    //     { address: Like(`%전남%`) },
    //     { address: Like(`%광주%`) },
    //   ],
    // });
    // // 경상도 옵션
    // if (address === '경상') {
    //   return await this.companyRepository.find({
    //     where: [
    //       { address: Like(`%경북%`) },
    //       { address: Like(`%경남%`) },
    //       { address: Like(`%대구%`) },
    //       { address: Like(`%울산%`) },
    //       { address: Like(`%부산%`) },
    //     ],
    //   });
    //   return await this.companyRepository.find({
    //     where: [
    //       { address: Like(`%경북%`) },
    //       { address: Like(`%경남%`) },
    //       { address: Like(`%대구%`) },
    //       { address: Like(`%울산%`) },
    //       { address: Like(`%부산%`) },
    //     ],
    //   });
    // }
    // 리턴값
    const resData = await this.companyRepository.find({
      where: { address: Like(`%${address}%`) },
    });

    if (resData.length === 0) {
      throw new HttpException(
        '지역에 해당하는 회사가 없습니다.',
        HttpStatus.GONE,
      );
    }

    return resData;
  }

  // 가입된 이메일이 있는지 확인
  async findEmail(email: string) {
    const isEmail = await this.companyRepository.findOne({
      select: { id: true, email: true, password: true, isVerified: true },
      where: { email },
    });
    return isEmail;
  }

  // 회사 1개 조회 - 마이페이지용
  async findOneCompanyById(companyId: string) {
    const company = await this.companyRepository.findOne({
      where: { id: companyId },
    });
    return company;
  }

  // 회사 1개 조회- 상세페이지용
  async finOneCompany(id: string) {
    const company = await this.companyRepository.findOne({
      where: { id },
    });

    return company;
  }

  // 회사 수정
  async updateCompany(id: string, updateCompanyDto: UpdateCompanyDto) {
    const company = await this.companyRepository.findOne({
      where: { id },
    });
    if (!company) {
      throw new HttpException(
        '회사를 찾을 수 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // 비밀번호가 존재하면 해시값으로 변경
    if (updateCompanyDto.password) {
      updateCompanyDto.password = await bcrypt.hash(
        updateCompanyDto.password,
        10,
      );
    }

    Object.assign(company, updateCompanyDto);
    return await this.companyRepository.save(company);
  }

  // 회사 이미지 수정
  async updateCompanyImage(id: string, image: string) {
    const isCompany = await this.companyRepository.findOne({ where: { id } });
    console.log(isCompany);
    if (!isCompany) {
      throw new HttpException(
        '회사를 찾을 수 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
    isCompany.image = image;

    await this.companyRepository.save(isCompany);
    return isCompany;
  }

  // 소프트 리무브
  // 윤영님꺼랑 똑같이 했는데 될지모르겠다
  @Cron('0 0 * * *')
  async cleanupResumes() {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    console.log(oneDayAgo);
    const cleanupTarget = await this.companyRepository.find({
      withDeleted: true,
    });

    for (const company of cleanupTarget) {
      if (company.deletedAt <= oneDayAgo && company.deletedAt !== null) {
        await this.companyRepository.remove(company);
      }
    }
  }

  // 회사 삭제
  async removeCompany(id: string) {
    const company = await this.companyRepository.findOne({
      where: { id },
    });

    if (!company) {
      throw new HttpException(
        '회사를 찾을 수 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // 소프트 딜리트
    const deletCompany = await this.companyRepository.softRemove(company);

    if (!deletCompany) {
      throw new HttpException('삭제에 실패했습니다', HttpStatus.BAD_REQUEST);
    }
    return { message: `${deletCompany.title} 가 삭제되었습니다.` };
  }

  // 인증번호 저장
  async storeVerificationCode(email: string, code: string): Promise<void> {
    const company = this.companyRepository.create({
      email,
      verificationCode: code,
    });
    await this.companyRepository.save(company);
  }

  // 인증번호 맞는지 확인
  async verifyCode(email: string, code: string): Promise<boolean> {
    const company = await this.companyRepository.findOne({
      where: { email, verificationCode: code },
    });
    return !!company; // 회사 정보가 있다면 true, 없다면 false 반환
  }

  // 회사의 인증상태를 변경하는 함수
  async updateCompanyVerification(
    email: string,
    isVerified: boolean,
  ): Promise<boolean> {
    try {
      const company = await this.companyRepository.findOne({
        where: { email },
      });

      if (!company) {
        throw new HttpException(
          '사용자를 찾을 수 없습니다.',
          HttpStatus.NOT_FOUND,
        );
      }

      company.isVerified = isVerified;

      await this.companyRepository.save(company);
      return true; // 성공적으로 업데이트되었음을 반환
    } catch (error) {
      throw new HttpException(
        '사용자 업데이트 실패',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 회사를 생성할 때, 기존 사용자의 정보를 update한다.
  async updateCompanyInfo(createCompanyDto: CreateCompanyDto): Promise<any> {
    const { email, password } = createCompanyDto;

    const existingCompany = await this.companyRepository.findOne({
      where: { email },
    });

    if (!existingCompany) {
      throw new HttpException(
        '사용자를 찾을 수 없습니다.',
        HttpStatus.NOT_FOUND,
      );
    }

    // 인증된 사용자인 경우에만 정보 업데이트
    if (existingCompany.isVerified) {
      existingCompany.title = createCompanyDto.title;
      existingCompany.introduction = createCompanyDto.introduction;
      existingCompany.website = createCompanyDto.website;
      existingCompany.address = createCompanyDto.address;
      existingCompany.business = createCompanyDto.business;
      existingCompany.employees = createCompanyDto.employees;
      existingCompany.image = createCompanyDto.image;

      if (password) {
        // 새로운 비밀번호가 제공된 경우에만 업데이트
        const hashedPassword = await bcrypt.hash(password, 10);
        existingCompany.password = hashedPassword;
      }

      await this.companyRepository.save(existingCompany);

      return '사용자 정보가 업데이트되었습니다.';
    } else {
      throw new HttpException(
        '이메일 인증을 진행해주세요!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

// // 옵션 설정 빈 배열
// let selectOption = {};

// // 옵션이 전체를 나타낼 때 예외처리
// if (occupation === '직군 전체' && workArea === '지역 전국') {
//   const resData = await this.companyRepository.find();
//   // 예외처리
//   if (resData.length === 0) {
//     throw new HttpException(
//       '선택옵션에 해당하는 회사가 없습니다.',
//       HttpStatus.GONE,
//     );
//   }
//   // 반환값
//   return resData;
// }
// // 직군 설정
// const occupations = occupation.split('·'); // 디자인, 마케팅, 광고
// const businessFilters = occupations.map((occ) => ({
//   business: Like(`%${occ}%`),
// }));
// // console.log(businessFilters);
// // const business =
// //   (businessFilters[0].business,
// //   businessFilters[1].business,
// //   businessFilters[2].business);
// // console.log(business);
// // selectOption['business'] = business;

// // 지역 설정
// if (workArea !== '지역 전국') {
//   selectOption['address'] = Like(`%${workArea}%`);
// }
// // 옵션 적용
// const searchOptions = { where: selectOption };
// console.log(searchOptions);
// // 반환값
// const resData = await this.companyRepository.find(searchOptions);
// // 예외처리
// if (resData.length === 0) {
//   throw new HttpException(
//     '선택옵션에 해당하는 회사가 없습니다.',
//     HttpStatus.GONE,
//   );
// }
// // 반환값
// return resData;

// 직군 설정
// if (occupation !== '직군 전체') {
//   const occupations = occupation.split('·');

//   console.log(occupations[0]);

//   console.log(occupations); // [ '디자인', '마케팅', '광고' ]

//   queryBuilder.andWhere(
//     'company.business LIKE :business OR company.business LIKE :business1 OR company.business LIKE :business2',
//     {
//       business: `%${occupations[0]}%`,
//       business1: `%${occupations[1]}%`,
//       business2: `%${occupations[2]}%`,
//     },
//   );
// }
