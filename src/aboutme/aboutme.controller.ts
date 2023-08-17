import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AboutmeService } from './aboutme.service';
import { CreateAboutmeDto } from './dto/create-aboutme.dto';
import { UpdateAboutmeDto } from './dto/update-aboutme.dto';

@Controller('aboutmes')
export class AboutmeController {
  constructor(private readonly aboutmeService: AboutmeService) {}

  @Post()
  create(@Body() createAboutmeDto: CreateAboutmeDto) {
    return this.aboutmeService.create(createAboutmeDto);
  }

  @Get()
  findAll() {
    return this.aboutmeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aboutmeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAboutmeDto: UpdateAboutmeDto) {
    return this.aboutmeService.update(+id, updateAboutmeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.aboutmeService.remove(+id);
  }
}
