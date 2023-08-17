import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApplyService } from './apply.service';
import { CreateApplyDto } from './dto/create-apply.dto';
import { UpdateApplyDto } from './dto/update-apply.dto';

@Controller('apply')
export class ApplyController {
  constructor(private readonly applyService: ApplyService) {}

  @Post()
  create(@Body() createApplyDto: CreateApplyDto) {
    return this.applyService.create(createApplyDto);
  }

  @Get()
  findAll() {
    return this.applyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.applyService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateApplyDto: UpdateApplyDto) {
    return this.applyService.update(+id, updateApplyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.applyService.remove(+id);
  }
}
