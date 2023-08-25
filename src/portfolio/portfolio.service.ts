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
      where: { resumeId },
    });

    if (!existingResume) {
      throw new HttpException(
        '아직 포트폴리오를 등록할 "이력서"를 작성하지 않으셨어용 ~',
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
    // 이력서 검증
    const existingResume = await this.portfolioRepository.findOne({
      where: { resumeId },
    });
    // 이력서 예외처리
    if (!existingResume) {
      throw new HttpException(
        '이력서를 찾을 수 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
    // 수정할 포트폴리오
    const portfolio = await this.portfolioRepository.findOne({
      where: {
        id: portfolioId,
      },
    });

    Object.assign(portfolio, id, updatePortfoiloDto);
    // 반환값
    return await this.portfolioRepository.save(portfolio);
  }
  // 포트폴리오 삭제
  async removePortfolio(id: number, resumeId: number, portfolioId: number) {
    // 이력서 존재여부 체크
    const existingResume = await this.portfolioRepository.findOne({
      where: { resumeId },
    });
    // 이력서 예외처리
    if (!existingResume) {
      throw new HttpException(
        '이력서를 찾을 수 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
    // 삭제할 포트폴리오 체크
    const portfolio = await this.portfolioRepository.findOne({
      where: { id: portfolioId },
    });
    // 예외처리
    if (!portfolio) {
      throw new HttpException(
        '해당하는 포트폴리오가 존재하지 않습니다.',
        HttpStatus.NOT_FOUND,
      );
    }
    // 리턴값
    return await this.portfolioRepository.remove(portfolio);
  }
}
