import { Injectable, UnauthorizedException } from '@nestjs/common';
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
  async createCompany({
    createCompanyDto,
  }: ICompanyServiceCreateCompany): Promise<Company> {
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
  async findAll() {
    return await this.companyRepository.find();
  }

  // 회사 1개 조회
  async findOne(id: number) {
    return await this.companyRepository.findOne({ where: { id } });
  }

  // 회사 수정
  async update(id: number, updateCompanyDto: UpdateCompanyDto) {
    const company = await this.companyRepository.findOne({ where: { id } });
    if (!company) {
      throw new Error('회사를 찾을 수 없습니다.');
    }
    Object.assign(company, updateCompanyDto);
    return await this.companyRepository.save(company);
  }

  async remove(id: number) {
    const company = await this.companyRepository.findOne({ where: { id } });
    if (!company) {
      throw new Error('회사를 찾을 수 없습니다.');
    }
    return await this.companyRepository.remove(company);
  }
}

interface ICompanyServiceCreateCompany {
  createCompanyDto: CreateCompanyDto;
}
