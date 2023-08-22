import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateAboutmeDto } from 'src/aboutme/dto/update-aboutme.dto';
import { Portfolio } from 'src/domain/portfolio.entity';
import { Repository } from 'typeorm';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(Portfolio)
    private readonly portfolioRepository: Repository<Portfolio>,
  ) {}

  // 포트폴리오 생성
  async createPortfolio(
    id: number,
    resumeId: number,
    createPortfolioDto: CreatePortfolioDto,
  ): Promise<Portfolio> {
    const { address, file } = createPortfolioDto;

    const newPortfolio = await this.portfolioRepository.save({
      resumeId,
      address,
      file,
    });
    return newPortfolio;
  }

  // 포트폴리오 조회
  async getPortfolio(id: number, resumeId: number): Promise<Portfolio[]> {
    const existingResume = await this.portfolioRepository.findOne({
      where: { id: resumeId },
    });

    if (!existingResume) {
      throw new HttpException(
        '이력서를 찾을 수 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.portfolioRepository.find({ where: { resumeId } });
  }

  // 포트폴리오 수정
  async updatePortfolio(
    id: number,
    resumeId: number,
    UpdatePortfolioDto: UpdatePortfolioDto,
  ) {
    const existingResume = await this.portfolioRepository.findOne({
      where: { id: resumeId },
    });

    if (!existingResume) {
      throw new HttpException(
        '이력서를 찾을 수 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
    Object.assign(existingResume, id, UpdatePortfolioDto);
    return await this.portfolioRepository.save(existingResume);
  }
  // 포트폴리오 삭제
  async removePortfolio(id: number, resumeId: number) {
    const existingResume = await this.portfolioRepository.findOne({
      where: { id: resumeId },
    });

    if (!existingResume) {
      throw new HttpException(
        '이력서를 찾을 수 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.portfolioRepository.remove(existingResume);
  }
}
