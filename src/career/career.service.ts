// 비즈니스 로직, DB와 상호작용을 담당.

import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Career } from 'src/domain/career.entity';
import { CreateCareerDto } from './dto/create-career.dto';
import { UpdateCareerDto } from './dto/update-career.dto';

// CareerService 클래스는 실제 비즈니스 로직을 처리함과 동시에
// DB와의 상호작용을 담당한다.
// @Injectable을 사용하여 'Career' 엔티티에 대한 레포지토리를 주입(?) 받는다.
@Injectable()
export class CareerService {
  constructor(
    @InjectRepository(Career)
    private readonly careerRepository: Repository<Career>,
  ) {}

  // createCarrer 함수는 새로운 경력에 대한 정보를 생성, 저장한다.
  async createCarrer(createCareerDto: CreateCareerDto) {
    const { companyTitle, job, joiningDate, resignationDate, position } =
      createCareerDto;

    const newCareer = await this.careerRepository.save({
      companyTitle,
      job,
      joiningDate,
      resignationDate,
      position,
    });
    return newCareer;
  }

  // findAllCarrer 함수는 모든 경력 정보를 조회한다.
  async findAllCarrer() {
    return this.careerRepository.find();
  }

  // updateCarrer 함수는 특정 ID에 해당하는 경력 정보를 업데이트한다.
  async updateCarrer(id: number, updateCareerDto: UpdateCareerDto) {
    const career = await this.careerRepository.findOne({ where: { id } });
    if (!career) {
      throw new HttpException(
        '해당 경력을 찾을 수 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
    Object.assign(career, updateCareerDto);
    await this.careerRepository.save(career);

    return `해당 경력이 수정되었습니다.`;
  }

  // removeCarrer 함수는 특정 ID에 해당하는 경력 정보를 삭제한다.
  async removeCarrer(id: number) {
    const career = await this.careerRepository.findOne({ where: { id } });
    if (!career) {
      throw new HttpException(
        '경력을 찾을 수 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.careerRepository.remove(career);
  }
}
