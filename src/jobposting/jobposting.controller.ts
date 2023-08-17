import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { JobpostingService } from './jobposting.service';
import { CreateJobpostingDto } from './dto/create-jobposting.dto';
import { UpdateJobpostingDto } from './dto/update-jobposting.dto';

@Controller('jobpostings')
export class JobpostingController {
  constructor(private readonly jobpostingService: JobpostingService) {}

  @Post()
  create(@Body() createJobpostingDto: CreateJobpostingDto) {
    return this.jobpostingService.create(createJobpostingDto);
  }

  @Get()
  findAll() {
    return this.jobpostingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobpostingService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateJobpostingDto: UpdateJobpostingDto,
  ) {
    return this.jobpostingService.update(+id, updateJobpostingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobpostingService.remove(+id);
  }
}
