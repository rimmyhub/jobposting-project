import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { Company } from 'src/domain/company.entity';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Controller('companys')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  // 회사 생성 + 회사 회원가입
  @Post()
  public async createCompany(
    @Body() createCompanyDto: CreateCompanyDto,
  ): Promise<Company> {
    const company = this.companyService.createCompany({ createCompanyDto });
    return company;
  }

  // 회사 전체 조회
  @Get()
  findAll() {
    return this.companyService.findAll();
  }

  // 회사 1개 조회
  @Get(':id')
  finOne(@Param('id') id: string) {
    return this.companyService.findOne(+id); //string 으로 가져와서 숫자로 변환
  }

  // 회사 수정
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.update(+id, updateCompanyDto);
  }

  // 회사 삭제
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyService.remove(+id);
  }
}
