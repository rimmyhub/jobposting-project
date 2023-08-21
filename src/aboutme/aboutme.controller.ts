import {
  Controller,
  Body,
  Param,
  UseGuards,
  Post,
  Request,
} from '@nestjs/common';
import { UserGuard } from 'src/auth/jwt/jwt.user.guard';
import { AboutmeService } from './aboutme.service';
import { CreateAboutmeDto } from './dto/create-aboutme.dto';
import { Aboutme } from 'src/domain/aboutme.entity';

@Controller('aboutmes')
export class AboutmeController {
  constructor(private readonly aboutmeService: AboutmeService) {}

  // 자기소개서 생성
  @UseGuards(UserGuard)
  @Post(':resumeId')
  createAboutme(
    @Request() req,
    @Param('resumeId') resumeId: string,
    @Body() createAboutmeDto: CreateAboutmeDto,
  ): Promise<Aboutme> {
    return this.aboutmeService.createAboutme(
      req.user.id,
      +resumeId,
      createAboutmeDto,
    );
  }

  // // 자기소개서 조회
  // @UseGuards(UserGuard)
  // @Post(':resumeId')
  // createAboutme(
  //   @Request() req,
  //   @Param('resumeId') resumeId: string,
  //   @Body() createAboutmeDto: CreateAboutmeDto,
  // ): Promise<Aboutme> {
  //   return this.aboutmeService.createAboutme(
  //     req.user.id,
  //     +resumeId,
  //     createAboutmeDto,
  //   );
  // }
}
