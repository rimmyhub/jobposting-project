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

    const newAboutme = await this.aboutmeRepository.save({
      resumeId,
      title,
      content,
    });
    return newAboutme;
  }

  // 자기소개서 조회
  async getAboutme(id: number, resumeId: number): Promise<Aboutme[]> {
    const existingResume = await this.aboutmeRepository.findOne({
      where: { id: resumeId },
    });

    if (!existingResume) {
      throw new HttpException(
        '이력서를 찾을 수 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.aboutmeRepository.find({ where: { resumeId } });
  }

  // 자기소개서 수정
  async updateAboutme(
    id: number,
    resumeId: number,
    updateAboutmeDto: UpdateAboutmeDto,
  ) {
    const existingResume = await this.aboutmeRepository.findOne({
      where: { id: resumeId },
    });

    // paylode의 id를 가져오려면 어떻게 해야하지?
    // console.log(existingResume.resumeId);
    // if (existingResume.userId !== id) {
    //   throw new HttpException('권한이 없습니다.', HttpStatus.FORBIDDEN);
    // }

    if (!existingResume) {
      throw new HttpException(
        '이력서를 찾을 수 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
    Object.assign(existingResume, id, updateAboutmeDto);
    return await this.aboutmeRepository.save(existingResume);
  }

  // 자기소개서 삭제
  async removeAboutme(id: number, resumeId: number) {
    const existingResume = await this.aboutmeRepository.findOne({
      where: { id: resumeId },
    });

    if (!existingResume) {
      throw new HttpException(
        '이력서를 찾을 수 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.aboutmeRepository.remove(existingResume);
  }
}
