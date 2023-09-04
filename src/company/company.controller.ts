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
  ValidationPipe,
  UsePipes,
  HttpStatus,
  HttpException,
  Query,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { Company } from 'src/domain/company.entity';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompanyGuard } from '../auth/jwt/jwt.company.guard';
import { ParamDto } from 'src/utils/param.dto';
import { MailService } from '../mail/mail.service';
import { VerifyCodeDto } from './dto/verify-code.dto';

@Controller('api/companies')
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly mailService: MailService,
  ) {}

  // 회사 회원가입
  @UsePipes(ValidationPipe)
  @Post('/signup')
  async createCompany(@Body() createCompanyDto: CreateCompanyDto) {
    if (createCompanyDto.isVerified !== true) {
      throw new HttpException(
        '이메일 인증을 진행해주세요!',
        HttpStatus.BAD_REQUEST,
      );
    }
    // 해당 companyId를 가진 사용자를 찾아 정보를 업데이트합니다.
    const updatedCompany =
      await this.companyService.updateCompanyInfo(createCompanyDto);

    return updatedCompany;
  }

  // 회사 전체 조회
  @Get()
  findAllCompany(@Query('page') page: string) {
    return this.companyService.findAllCompany({ page: Number(page) });
  }

  // 검색시 업무 또는 회사 이름에 해당 검색어를 포함하는 회사 전체 조회
  @Get('search')
  findSearchTag(@Body('title') title: string) {
    return this.companyService.findSearchTag(title);
  }

  // 회사 1개 조회
  @Get(':id')
  finOneCompany(@Param() { id }: ParamDto) {
    return this.companyService.finOneCompany(id); //string 으로 가져와서 숫자로 변환
  }

  // 회사 수정 (회사 연결)
  @UseGuards(CompanyGuard)
  @Patch()
  updateCompany(@Request() req, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.updateCompany(req.company.id, updateCompanyDto);
  }

  // 회사 회원 탈퇴 (회사 연결)
  @UseGuards(CompanyGuard)
  @Delete()
  removeCompany(@Request() req) {
    return this.companyService.removeCompany(req.company.id);
  }

  // 인증번호 전송
  @Post('/send-verification')
  async sendVerification(@Body('email') email: string) {
    const existingCompany = await this.companyService.findEmail(email);

    if (existingCompany) {
      if (existingCompany.isVerified) {
        // 이미 가입되고 인증된 이메일인 경우 응답으로 처리
        throw new HttpException(
          '이미 가입된 이메일입니다.',
          HttpStatus.BAD_REQUEST,
        );
      }
      // DB에 저장된 이메일이지만 아직 인증되지 않은 경우 이메일 전송 처리로 진행
    }

    try {
      const verificationCode = this.generateVerificationCode(); // 인증번호 생성

      // 이메일 발송 로직
      await this.mailService.sendMail(email, verificationCode);

      // 인증번호 저장
      await this.companyService.storeVerificationCode(email, verificationCode);

      return { message: '이메일로 인증번호가 전송되었습니다.' };
    } catch (error) {
      throw new HttpException(
        '인증번호 전송에 실패했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private generateVerificationCode(): string {
    // 인증번호 생성
    return Math.random().toString(36).substr(2, 6).toUpperCase();
  }

  @Post('/verify')
  async verifyCode(@Body() verifyCodeDto: VerifyCodeDto) {
    const { email, code } = verifyCodeDto;
    const isValid = await this.companyService.verifyCode(email, code);

    if (isValid) {
      const updatedCompany =
        await this.companyService.updateCompanyVerification(email, true);
      if (updatedCompany) {
        return { message: '인증이 완료되었습니다.' };
      } else {
        throw new HttpException(
          '회사 정보 업데이트에 실패했습니다.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } else {
      throw new HttpException(
        '올바른 인증번호를 입력해주세요.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
