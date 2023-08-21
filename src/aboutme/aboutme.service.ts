import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Aboutme } from 'src/domain/aboutme.entity';
import { Repository } from 'typeorm';
import { CreateAboutmeDto } from './dto/create-aboutme.dto';

@Injectable()
export class AboutmeService {
  constructor(
    @InjectRepository(Aboutme)
    private readonly aboutmeRepository: Repository<Aboutme>,
  ) {}

  async createAboutme(
    id: number,
    resumeId: number,
    createAboutmeDto: CreateAboutmeDto,
  ): Promise<Aboutme> {
    const { title, content } = createAboutmeDto;

    const newAboutme = await this.aboutmeRepository.save({
      id,
      resumeId,
      title,
      content,
    });
    return newAboutme;
  }
}
