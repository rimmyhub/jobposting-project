import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from '../domain/company.entity';
import { IsNull, LessThanOrEqual, Not, Repository } from 'typeorm';
import { CreateCompanyDto } from './dto/create-company.dto';
import * as bcrypt from 'bcrypt';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Cron } from '@nestjs/schedule';

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
    id: number,
  ): Promise<Company> {
    const company: Company = await this.companyRepository.findOne({
      select: {
        email: true,
        currentRefreshToken: true,
        currentRefreshTokenExp: true,
      },
      where: { id },
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
    } = createCompanyDto;

    const company = await this.companyRepository.findOne({ where: { email } });
    if (company) throw new UnauthorizedException('이미 등록된 이메일입니다');
    const hashedPassword = await bcrypt.hash(password, 10);
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
    });
    return newCompany;
  }

  // 회사 전체 조회
  async findAllCompany() {
    return await this.companyRepository.find();
  }

  // 검색시 업무 또는 회사 이름에 해당 검색어를 포함하는 회사 전체 조회
  async findSearchTag(title: string) {
    const searchCompanies = await this.companyRepository
      .createQueryBuilder('company')
      .select([
        'company.title',
        'company.image',
        'company.business',
        'company.employees',
      ])
      .where('company.title LIKE :title OR company.business LIKE :title', {
        title: `%${title}%`,
      })
      .getMany();

    if (searchCompanies.length === 0) {
      throw new HttpException(
        '검색하신 항목이 존재하지 않습니다.',
        HttpStatus.NOT_FOUND,
      );
    }
    return searchCompanies;
  }

  // 가입된 이메일이 있는지 확인
  async findEmail(email: string) {
    const isEmail = await this.companyRepository.findOne({
      select: { id: true, email: true, password: true },
      where: { email },
    });
    return isEmail;
  }

  // 회사 1개 조회
  async finOneCompany(id: number) {
    return await this.companyRepository.findOne({ where: { id: id } });
  }

  // 회사 수정
  async updateCompany(id: number, updateCompanyDto: UpdateCompanyDto) {
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
  async removeCompany(id: number) {
    const company = await this.companyRepository.findOne({ where: { id } });

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
}
