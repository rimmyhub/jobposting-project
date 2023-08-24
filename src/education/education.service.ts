import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Education } from 'src/domain/education.entity';
import { Repository } from 'typeorm';
import { educationType } from 'commons/education.enums';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EducationService {
  constructor(
    @InjectRepository(Education)
    private readonly educationRepository: Repository<Education>,
    private configService: ConfigService,
  ) {}

  // 학력 - 등록
  async createEducation(
    resumeId: number,
    createEducationDto: CreateEducationDto,
  ): Promise<Education> {
    // Body
    const { schoolTitle, admissionYear, graduationYear, major, education } =
      createEducationDto;
    // 예외처리
    if (
      !schoolTitle ||
      !admissionYear ||
      !graduationYear ||
      !major ||
      !education
    ) {
      throw new HttpException(
        '필수 요소를 입력해주세요',
        HttpStatus.PRECONDITION_FAILED,
      );
    }
    // 연도 예외 처리
    if (admissionYear > graduationYear) {
      throw new HttpException(
        '작성연도가 올바르지 않습니다.',
        HttpStatus.PRECONDITION_FAILED,
      );
    }
    // 일치한 타입이 없는경우 예외 처리
    if (!Object.keys(educationType).includes(education)) {
      throw new HttpException(
        '학력 타입이 올바르지 않습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
    // 등록
    const resEducation = this.educationRepository.create({
      resumeId,
      schoolTitle,
      admissionYear,
      graduationYear,
      major,
      education: educationType[education],
    });
    // 예외처리
    if (!resEducation) {
      throw new HttpException(
        '학력 등록에 실패하였습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    // 저장
    await this.educationRepository.save(resEducation);
    // 반환
    return resEducation;
  }

  // 학력 - 조회
  async findEducation(resumeId: number): Promise<Education[]> {
    const educations = await this.educationRepository.find({
      where: { resumeId },
    });
    if (!educations.length) {
      throw new HttpException(
        { message: this.configService.get<string>('Is_Null_Education') },
        HttpStatus.NOT_FOUND,
      );
    }
    return educations;
  }

  // 학력 - 수정
  async updateEducation(
    educationId: number,
    updateEducationDto: UpdateEducationDto,
  ): Promise<Education> {
    // 수정할 학력 체크
    const eduData = await this.educationRepository.findOne({
      where: { id: educationId },
    });
    // 예외처리
    if (!eduData) {
      throw new HttpException('Not found education', HttpStatus.NOT_FOUND);
    }
    // Body
    const { schoolTitle, admissionYear, graduationYear, major, education } =
      updateEducationDto;
    // 연도 예외 처리
    if (admissionYear > graduationYear) {
      throw new HttpException(
        'Please set an appropriate year.',
        HttpStatus.PRECONDITION_FAILED,
      );
    }
    // 학력 예외처리
    if (!Object.keys(educationType).includes(education)) {
      throw new HttpException('Conflict Education Type', HttpStatus.CONFLICT);
    }
    // 학교이름 수정
    if (schoolTitle !== undefined) {
      eduData.schoolTitle = schoolTitle;
    }
    // 입학년도 수정
    if (admissionYear !== undefined) {
      eduData.admissionYear = admissionYear;
    }
    // 졸업년도 수정
    if (graduationYear !== undefined) {
      eduData.graduationYear = graduationYear;
    }
    // 전공 수정
    if (major !== undefined) {
      eduData.major = major;
    }
    // 학력 수정
    if (education !== undefined) {
      eduData.education = education;
    }
    // 저장
    await this.educationRepository.save(eduData);
    // 반환
    return eduData;
  }

  // 학력 - 삭제
  async removeEducation(educationId: number): Promise<object> {
    // 삭제할 학력 확인
    const eduData = await this.educationRepository.findOne({
      where: { id: educationId },
    });
    // 예외처리
    if (!eduData) {
      throw new HttpException('Not found Education', HttpStatus.NOT_FOUND);
    }
    // 삭제
    this.educationRepository.remove(eduData);
    // 반환
    return { message: '학력이 삭제되었습니다.' };
  }
}
