import { Injectable } from '@nestjs/common';
import { CreateApplyDto } from './dto/create-apply.dto';
import { UpdateApplyDto } from './dto/update-apply.dto';

@Injectable()
export class ApplyService {
  create(createApplyDto: CreateApplyDto) {
    return 'This action adds a new apply';
  }

  findAll() {
    return `This action returns all apply`;
  }

  findOne(id: number) {
    return `This action returns a #${id} apply`;
  }

  update(id: number, updateApplyDto: UpdateApplyDto) {
    return `This action updates a #${id} apply`;
  }

  remove(id: number) {
    return `This action removes a #${id} apply`;
  }
}
