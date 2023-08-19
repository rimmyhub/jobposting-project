import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { Company } from 'src/domain/company.entity';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompanyGuard } from 'src/auth/company.guard';
import { ParamDto } from 'src/utils/param.dto';

@Controller('companys')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  // 회사 생성 + 회사 회원가입
  @Post('/signup')
  createCompany(@Body() createCompanyDto: CreateCompanyDto): Promise<Company> {
    return this.companyService.createCompany(createCompanyDto);
  }

  // 회사 전체 조회
  @Get()
  findAllCompany() {
    return this.companyService.findAllCompany();
  }

  // 회사 1개 조회
  @Get(':id')
  finOneCompany(@Param() { id }: ParamDto) {
    return this.companyService.finOneCompany(id); //string 으로 가져와서 숫자로 변환
  }

  // 회사 수정
  // 유저 연결 물어보기
  @UseGuards(CompanyGuard)
  @Patch()
  updateCompany(@Request() req, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.updateCompany(req.company.id, updateCompanyDto);
  }

  // 회사 삭제
  @Delete(':id')
  removeCompany(@Param('id') id: string) {
    return this.companyService.removeCompany(+id);
  }
}
