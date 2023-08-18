import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/domain/company.entity';
import { Repository } from 'typeorm';
import { CreateCompanyDto } from './dto/create-company.dto';
import * as bcrypt from 'bcrypt';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  // 회사 생성 + 회사 회원가입
  async createCompany(createCompanyDto: CreateCompanyDto): Promise<Company> {
    const {
      email,
      companyTitle,
      password,
      introduction,
      website,
      address,
      business,
      employees,
    } = createCompanyDto;
    const company = await this.companyRepository.findOne({ where: { email } });
    if (company) throw new UnauthorizedException('이미 등록된 이메일입니다');
    const hashedPassword = await bcrypt.hash(password, 10);

    const newCompany = await this.companyRepository.save({
      email,
      companyTitle,
      password: hashedPassword,
      introduction,
      website,
      address,
      business,
      employees,
    });
    return newCompany;
  }

  // 회사 전체 조회
  async findAllCompany() {
    return await this.companyRepository.find();
  }

  // 가입된 이메일이 있는지 확인
  async findEmail(email: string) {
    const isEmail = await this.companyRepository.findOne({
      select: { email: true, password: true },
      where: { email },
    });
    // 이메일이 없을 경우
    if (!isEmail) {
      throw new HttpException(
        '가입되지 않은 이메일입니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
    return isEmail;
  }

  // 회사 1개 조회
  async finOneCompany(id: number) {
    return await this.companyRepository.findOne({ where: { id } });
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
    Object.assign(company, updateCompanyDto);
    return await this.companyRepository.save(company);
  }

  // 회사 삭제
  async removeCompany(id: number) {
    const company = await this.companyRepository.findOne({
      where: { id },
    });
    if (!company) {
      throw new HttpException(
        '회사를 찾을 수 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.companyRepository.remove(company);
  }
}
