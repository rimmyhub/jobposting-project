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
  Put,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompanyGuard } from '../auth/jwt/jwt.company.guard';

import { VerifyCodeDto } from './dto/verify-code.dto';

import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MailService } from '../mail/mail.service';

@Controller('api/companies')
@ApiTags('회사 API')
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly mailService: MailService,
  ) {}

  // 회사 회원가입
  @UsePipes(ValidationPipe)
  @Post('/signup')
  @ApiOperation({ summary: '회사 회원가입 API', description: '회사 회원가입' })
  @ApiCreatedResponse({ description: '회사 회원가입' })
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
  @ApiOperation({ summary: '회사 전체조회 API', description: '회사 전체조회' })
  @ApiCreatedResponse({ description: '회사 전체조회' })
  findAllCompany(@Query('page') page: string) {
    console.log('company page is : ', page);
    return this.companyService.findAllCompany({ page: Number(page) });
  }

  // 모든 회사의 주소 정보만 가져오기
  @Get('/addresses')
  @ApiOperation({ summary: '회사 주소조회 API', description: '회사 주소조회' })
  @ApiCreatedResponse({ description: '회사 주소조회' })
  async getAllCompanyAddresses() {
    return this.companyService.getAllCompanyAddresses();
  }

  // 윤영 : 검색시 업무 또는 회사 이름에 해당 검색어를 포함하는 회사 전체 조회
  @Post('search')
  @ApiOperation({ summary: '회사 검색 API', description: '회사 검색' })
  @ApiCreatedResponse({ description: '회사 검색' })
  searchKeyword(@Body('keyword') keyword: string) {
    return this.companyService.searchKeyword(keyword);
  }

  // 윤영 : 옵션설정시 해당 옵션을 포함하는 회사 전체 조회
  @Post('option')
  @ApiOperation({ summary: '회사 옵션조회 API', description: '회사 옵션조회' })
  @ApiCreatedResponse({ description: '회사 옵션조회' })
  searchOption(
    @Body('occupation') occupation: string,
    @Body('workArea') workArea: string,
  ) {
    return this.companyService.searchOption(occupation, workArea);
  }

  // 회사 1개 조회 - 마이페이지용
  @UseGuards(CompanyGuard)
  @Get('/company')
  @ApiOperation({
    summary: '회사 상세조회 API',
    description: '(마이페이지)회사 상세조회',
  })
  @ApiCreatedResponse({ description: '회사 상세조회' })
  findOneCompanyByRequest(@Request() req) {
    const companyId = req.company.id;
    return this.companyService.findOneCompanyById(companyId);
  }

  // 회사 1개 조회- 상세페이지용
  @Get(':id')
  @ApiOperation({
    summary: '회사 상세조회 API',
    description: '(상세페이지)회사 상세조회',
  })
  @ApiCreatedResponse({ description: '회사 상세조회' })
  finOneCompany(@Param('id') id: string) {
    console.log('finOneCompany= ', id);
    return this.companyService.finOneCompany(id);
  }

  // 회사 수정 (회사 연결)
  @UseGuards(CompanyGuard)
  @Patch()
  @ApiOperation({ summary: '회사 수정 API', description: '회사 수정' })
  @ApiCreatedResponse({ description: '회사 수정' })
  updateCompany(@Request() req, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.updateCompany(req.company.id, updateCompanyDto);
  }

  // 회사 이미지 수정
  @UseGuards(CompanyGuard)
  @Put('/image')
  @ApiOperation({
    summary: '회사 이미지 수정 API',
    description: '회사 이미지 수정',
  })
  @ApiCreatedResponse({ description: '회사 이미지 수정' })
  updateCompanyImage(@Request() req, @Body('image') image: string) {
    return this.companyService.updateCompanyImage(req.company.id, image);
  }

  // 회사 회원 탈퇴 (회사 연결)
  @UseGuards(CompanyGuard)
  @Delete()
  @ApiOperation({ summary: '회사 회원탈퇴 API', description: '회사 회원탈퇴' })
  @ApiCreatedResponse({ description: '회사 회원탈퇴' })
  removeCompany(@Request() req) {
    return this.companyService.removeCompany(req.company.id);
  }

  // 인증번호 전송
  @Post('/send-verification')
  @ApiOperation({
    summary: '회사 인증번호 전송 API',
    description: '회사 인증번호 전송',
  })
  @ApiCreatedResponse({ description: '회사 인증번호 전송' })
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
  @ApiOperation({ summary: '회사 코드인증 API', description: '회사 코드인증' })
  @ApiCreatedResponse({ description: '회사 코드인증' })
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
