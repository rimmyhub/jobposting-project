import { Injectable } from '@nestjs/common';
import { CreateAboutmeDto } from './dto/create-aboutme.dto';
import { UpdateAboutmeDto } from './dto/update-aboutme.dto';

@Injectable()
export class AboutmeService {
  create(createAboutmeDto: CreateAboutmeDto) {
    return 'This action adds a new aboutme';
  }

  findAll() {
    return `This action returns all aboutme`;
  }

  findOne(id: number) {
    return `This action returns a #${id} aboutme`;
  }

  update(id: number, updateAboutmeDto: UpdateAboutmeDto) {
    return `This action updates a #${id} aboutme`;
  }

  remove(id: number) {
    return `This action removes a #${id} aboutme`;
  }
}
