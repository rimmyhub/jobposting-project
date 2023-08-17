import { Injectable } from '@nestjs/common';
import { CreateJobpostingDto } from './dto/create-jobposting.dto';
import { UpdateJobpostingDto } from './dto/update-jobposting.dto';

@Injectable()
export class JobpostingService {
  create(createJobpostingDto: CreateJobpostingDto) {
    return 'This action adds a new jobposting';
  }

  findAll() {
    return `This action returns all jobposting`;
  }

  findOne(id: number) {
    return `This action returns a #${id} jobposting`;
  }

  update(id: number, updateJobpostingDto: UpdateJobpostingDto) {
    return `This action updates a #${id} jobposting`;
  }

  remove(id: number) {
    return `This action removes a #${id} jobposting`;
  }
}
