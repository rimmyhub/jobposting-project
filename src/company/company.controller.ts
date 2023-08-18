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
  createCompany(@Body() createCompanyDto: CreateCompanyDto): Promise<Company> {
    const company = this.companyService.createCompany(createCompanyDto);
    return company;
  }

  // 회사 전체 조회
  @Get()
  findAllCompany() {
    return this.companyService.findAllCompany();
  }

  // 회사 1개 조회
  @Get(':id')
  finOneCompany(@Param('id') id: string) {
    return this.companyService.finOneCompany(+id); //string 으로 가져와서 숫자로 변환
  }

  // 회사 수정
  @Patch(':id')
  updateCompany(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.companyService.updateCompany(+id, updateCompanyDto);
  }

  // 회사 삭제
  @Delete(':id')
  removeCompany(@Param('id') id: string) {
    return this.companyService.removeCompany(+id);
  }
}
