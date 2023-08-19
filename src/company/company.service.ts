import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/domain/company.entity';
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
      select: { id: true, email: true, password: true },
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

  //   // 회사 삭제
  //   async removeCompany(id: number) {
  //     const company = await this.companyRepository.findOne({
  //       where: { id, deletedAt: Not(IsNull()) },
  //     });
  //     if (!company) {
  //       throw new HttpException(
  //         '회사를 찾을 수 없습니다.',
  //         HttpStatus.BAD_REQUEST,
  //       );
  //     }
  //     return await this.companyRepository.softDelete(company);
  //   }
  // }

  // 회사 삭제 소프트 딜리트
  // 근데 안됨;; 왜 안될까..
  async removeCompany(id: number) {
    const company = await this.companyRepository.findOne({
      where: { id, deleted: false }, // 삭제되지 않은 회사만 조회
      //deleted를 true로 설정하고 deletedAt 속성에 현재시간을 저장하여 삭제된 것으로 표시
    });

    if (!company) {
      throw new HttpException(
        '회사를 찾을 수 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // 삭제 시각과 삭제 여부를 설정
    company.deleted = true;
    company.deletedAt = new Date();

    //companyRepository.save(company)를 호출하여 변경된 정보를 저장
    return await this.companyRepository.save(company);
  }

  // deleteOldData 메서드
  // @Cron 데코레이터를 사용하여 매 시간마다 실행되는 매서드
  // 현재 시간과 비교하여 일정 시간 이후에 삭제될 데이터를 조회해서 삭제
  @Cron('0 0 * * *') // 매 시간마다 실행
  async deleteOldData() {
    const now = new Date();
    const threshold = new Date(now.getTime() - 30); //일단 30초 //1시간:3600

    // deleted 가 true이면서 deletedAt가 일정 시간 이전인 회사를 조회
    const outdatedData = await this.companyRepository.find({
      where: {
        deleted: true,
        deletedAt: LessThanOrEqual(threshold),
        // 지정한 임계치보다 작거나 같은 데이터 필터링
      },
    });

    //outdatedData 배열에 데이터가 존재하는지 체크
    if (outdatedData.length > 0) {
      //Nest.js에서 제공하는 Logger 클래스를 사용하여 로그를 남기는 데 사용.
      this.logger.log(`Deleting ${outdatedData.length} outdated companies.`);
      //outdatedData 배열에 저장된 회사 데이터를 완전히 삭제
      await this.companyRepository.remove(outdatedData);
    }
  }
}
