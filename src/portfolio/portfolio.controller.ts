import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';

import { get } from 'http';
import { UserGuard } from 'src/auth/jwt/jwt.user.guard';
import { Portfolio } from 'src/domain/portfolio.entity';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { PortfolioService } from './portfolio.service';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('api/portfolio')
@ApiTags('포트폴리오 API')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  // 포트폴리오 생성
  @UseGuards(UserGuard)
  @Post(':resumeId')
  @ApiOperation({
    summary: '포트폴리오 생성 API',
    description: '포트폴리오 생성',
  })
  @ApiCreatedResponse({ description: '포트폴리오 생성' })
  createPortfolio(
    @Request() req,
    @Param('resumeId') resumeId: string,
    @Body() createPortfolioDto: CreatePortfolioDto,
  ): Promise<Portfolio> {
    return this.portfolioService.createPortfolio(
      req.user.id,
      +resumeId,
      createPortfolioDto,
    );
  }

  // 포트폴리오 조회
  @UseGuards(UserGuard)
  @Get(':resumeId')
  @ApiOperation({
    summary: '포트폴리오 조회 API',
    description: '포트폴리오 조회',
  })
  @ApiCreatedResponse({ description: '포트폴리오 조회' })
  getPortfolio(@Request() req, @Param('resumeId') resumeId: string) {
    return this.portfolioService.getPortfolio(req.user.id, +resumeId);
  }

  // 포트폴리오 수정
  @UseGuards(UserGuard)
  @Put(':resumeId/:portfolioId')
  @ApiOperation({
    summary: '포트폴리오 수정 API',
    description: '포트폴리오 수정',
  })
  @ApiCreatedResponse({ description: '포트폴리오 수정' })
  updatePortfolio(
    @Request() req,
    @Param('resumeId') resumeId: number,
    @Param('portfolioId') portfolioId: number,
    @Body() updatePortfoiloDto: UpdatePortfolioDto,
  ) {
    return this.portfolioService.updatePortfolio(
      req.user.id,
      +resumeId,
      +portfolioId,
      updatePortfoiloDto,
    );
  }
  // 포트폴리오 삭제
  @UseGuards(UserGuard)
  @Delete(':resumeId/:portfolioId')
  @ApiOperation({
    summary: '포트폴리오 삭제 API',
    description: '포트폴리오 삭제',
  })
  @ApiCreatedResponse({ description: '포트폴리오 삭제' })
  removePortfolio(
    @Request() req,
    @Param('resumeId') resumeId: number,
    @Param('portfolioId') portfolioId: number,
  ) {
    return this.portfolioService.removePortfolio(
      req.user.id,
      +resumeId,
      +portfolioId,
    );
  }
}
