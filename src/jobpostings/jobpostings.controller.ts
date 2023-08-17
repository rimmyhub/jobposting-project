import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { JobpostingsService } from './jobpostings.service';
import { CreateJobpostingDto } from './dto/create-jobposting.dto';
import { UpdateJobpostingDto } from './dto/update-jobposting.dto';

@Controller('jobpostings')
export class JobpostingsController {
  constructor(private readonly jobpostingsService: JobpostingsService) {}

  @Post()
  create(@Body() createJobpostingDto: CreateJobpostingDto) {
    return this.jobpostingsService.create(createJobpostingDto);
  }

  @Get()
  findAll() {
    return this.jobpostingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobpostingsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJobpostingDto: UpdateJobpostingDto) {
    return this.jobpostingsService.update(+id, updateJobpostingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobpostingsService.remove(+id);
  }
}
