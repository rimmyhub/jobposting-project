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
    const existingPortfolio = await this.portfolioRepository.findOne({
      where: { resumeId },
    });

    if (!existingPortfolio) {
      throw new HttpException(
        '등록된 포트폴리오가 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.portfolioRepository.find({ where: { resumeId } });
  }

  // 포트폴리오 수정
  async updatePortfolio(
    id: number,
    resumeId: number,
    portfolioId: number,
    updatePortfoiloDto: UpdatePortfolioDto,
  ) {
    // 포폴 검증
    const existingPortfolio = await this.portfolioRepository.findOne({
      where: { id: portfolioId },
    });
    // 포폴 예외처리
    if (!existingPortfolio) {
      throw new HttpException(
        '포트폴리오가 존재하지 않습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    Object.assign(existingPortfolio, id, updatePortfoiloDto);
    // 반환값
    return await this.portfolioRepository.save(existingPortfolio);
  }
  // 포트폴리오 삭제
  async removePortfolio(id: number, resumeId: number, portfolioId: number) {
    // 포폴 존재여부 체크
    const existingPortfolio = await this.portfolioRepository.findOne({
      where: { id: portfolioId },
    });
    // 포폴 예외처리
    if (!existingPortfolio) {
      throw new HttpException(
        '포트폴리오가 존재하지 않습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
    // 리턴값
    return await this.portfolioRepository.remove(existingPortfolio);
  }
}
