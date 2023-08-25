import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Aboutme } from 'src/domain/aboutme.entity';
import { Repository } from 'typeorm';
import { CreateAboutmeDto } from './dto/create-aboutme.dto';
import { UpdateAboutmeDto } from './dto/update-aboutme.dto';

@Injectable()
export class AboutmeService {
  constructor(
    @InjectRepository(Aboutme)
    private readonly aboutmeRepository: Repository<Aboutme>,
  ) {}

  // 자기소개서 생성
  async createAboutme(
    id: number,
    resumeId: number,
    createAboutmeDto: CreateAboutmeDto,
  ): Promise<Aboutme> {
    const { title, content } = createAboutmeDto;

    // 예외처리
    if (!title && !content) {
      throw new HttpException(
        '생성할 자기소개서의 제목과 내용을 입력하십시오.',
        HttpStatus.PRECONDITION_FAILED,
      );
    }
    // 자기소개 생성
    const aboutme = this.aboutmeRepository.create({
      resumeId,
      title,
      content,
    });
    // 반환값
    return await this.aboutmeRepository.save(aboutme);
  }

  // 자기소개서 조회
  async getAboutme(id: number, resumeId: number): Promise<Aboutme[]> {
    const existingResume = await this.aboutmeRepository.findOne({
      where: { resumeId },
    });

    if (!existingResume) {
      throw new HttpException(
        '아직 자기소개서를 등록할 "이력서"를 작성하지 않으셨어용 *^.^*',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.aboutmeRepository.find({ where: { resumeId } });
  }

  // 자기소개서 수정
  async updateAboutme(
    id: number,
    resumeId: number,
    aboutmeId: number,
    updateAboutmeDto: UpdateAboutmeDto,
  ) {
    // 이력서 존재여부 확인
    const existingResume = await this.aboutmeRepository.findOne({
      where: { resumeId },
    });

    // paylode의 id를 가져오려면 어떻게 해야하지?
    // console.log(existingResume.resumeId);
    // if (existingResume.userId !== id) {
    //   throw new HttpException('권한이 없습니다.', HttpStatus.FORBIDDEN);
    // }
    // 이력서 예외처리
    if (!existingResume) {
      throw new HttpException(
        '이력서를 찾을 수 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
    const updateAboutMe = await this.aboutmeRepository.findOne({
      where: { id: aboutmeId },
    });
    if (!updateAboutMe) {
      throw new HttpException(
        '해당하는 자기소개서가 없네요?',
        HttpStatus.NOT_FOUND,
      );
    }
    Object.assign(updateAboutMe, id, updateAboutmeDto);
    return await this.aboutmeRepository.save(updateAboutMe);
  }

  // 자기소개서 삭제
  async removeAboutme(id: number, resumeId: number, aboutmeId: number) {
    // 이력서 체크
    const existingResume = await this.aboutmeRepository.findOne({
      where: { resumeId },
    });
    // 이력서 예외처리
    if (!existingResume) {
      throw new HttpException(
        '이력서를 찾을 수 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
    // 자기소개서 체크
    const deleteAboutMe = await this.aboutmeRepository.findOne({
      where: { id: aboutmeId },
    });
    // 예외처리
    if (!deleteAboutMe) {
      throw new HttpException(
        '해당 자소서가 존재하지 않습니다.',
        HttpStatus.NOT_FOUND,
      );
    }
    // 반환
    return await this.aboutmeRepository.remove(deleteAboutMe);
  }
}
