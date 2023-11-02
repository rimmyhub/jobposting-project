import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { CreateAboutmeDto } from './dto/create-aboutme.dto';
import { UpdateAboutmeDto } from './dto/update-aboutme.dto';
import { Aboutme } from '../domain/aboutme.entity';

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
    const aboutMe = this.aboutmeRepository.create({
      resumeId,
      title,
      content,
    });
    // 반환값
    return await this.aboutmeRepository.save(aboutMe);
  }

  // 자기소개서 조회
  async getAboutme(id: number, resumeId: number): Promise<Aboutme[]> {
    const existingAboutMe = await this.aboutmeRepository.findOne({
      where: { resumeId },
    });
    console.log(existingAboutMe);
    if (!existingAboutMe) {
      throw new HttpException(
        '등록된 자기소개서가 없습니다.',
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
    // 자소서 존재여부 확인
    const existingAboutMe = await this.aboutmeRepository.findOne({
      where: { id: aboutmeId },
    });

    // 자소서 예외처리
    if (!existingAboutMe) {
      throw new HttpException(
        '자기소개서가 존재하지 않습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    Object.assign(existingAboutMe, id, updateAboutmeDto);
    return await this.aboutmeRepository.save(existingAboutMe);
  }

  // 자기소개서 삭제
  async removeAboutme(id: number, resumeId: number, aboutmeId: number) {
    // 자소서 체크
    const existingAboutMe = await this.aboutmeRepository.findOne({
      where: { id: aboutmeId },
    });
    // 자소서 예외처리
    if (!existingAboutMe) {
      throw new HttpException(
        '자기소개서가 존재하지 않습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
    // 반환
    return await this.aboutmeRepository.remove(existingAboutMe);
  }
}
