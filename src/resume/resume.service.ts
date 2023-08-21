import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Resume } from 'src/domain/resume.entity';
import { Repository } from 'typeorm';

@Injectable()
// 해당 객체 export
export class ResumeService {
  // 생성자 함수 - 인스턴스 생성 시 실행 / 인자 추가 가능
  constructor(
    // 괄호안의 엔티티(모델)명을 가진 DB와 작업 진행
    @InjectRepository(Resume)
    private readonly resumeRepository: Repository<Resume>,
  ) {}

  // 이력서 - 작성 로직
  async createResume(createResumeDto: CreateResumeDto): Promise<Resume> {
    // Body
    const { title, content } = createResumeDto;
    // 이력서 생성
    const resume = this.resumeRepository.create({
      resumeTitle: title,
      resumeContent: content,
    });
    // 유저가드 활성화 시 해당 코드 없으면 DB 저장 안됨.
    await this.resumeRepository.save(resume);
    // 반환값
    return resume;
  }

  // 이력서 - 전체 조회
  async findAllResume(): Promise<Resume[]> {
    // 삭제되지 않은 이력서 중에서 이력서의 제목만 반환
    return await this.resumeRepository.find({
      where: { deletedAt: null },
      select: ['id', 'resumeTitle'],
    });
  }

  // 이력서 - 상세 조회
  async findOneResume(resumeId: number): Promise<Resume> {
    // 해당 이력서 조회
    const resume = await this.resumeRepository.findOne({
      where: { id: resumeId },
      select: ['resumeTitle', 'resumeContent'],
    });
    // 예외 처리
    if (!resume) {
      throw new HttpException('Not found resume', HttpStatus.NOT_FOUND);
    }
    // 반환
    return resume;
  }

  // 이력서 - 수정
  async updateResume(
    resumeId: number,
    updateResumeDto: UpdateResumeDto,
  ): Promise<Resume> {
    // 수정 이력서 확인
    const resume = await this.resumeRepository.findOne({
      where: { id: resumeId },
    });
    // 예외처리
    if (!resume) {
      throw new HttpException('Not found resume', HttpStatus.NOT_FOUND);
    }
    // Body 데이터
    const { title, content } = updateResumeDto;
    // 제목 수정
    if (title !== undefined) {
      resume.resumeTitle = title;
    }
    // 내용 수정
    if (content !== undefined) {
      resume.resumeContent = content;
    }
    // 수정한 이력서 저장
    await this.resumeRepository.save(resume);
    // 반환
    return resume;
  }

  // 이력서 - 삭제
  async removeResume(resumeId: number): Promise<HttpStatus> {
    // 삭제할 이력서 확인
    const resume = await this.resumeRepository.findOne({
      where: { id: resumeId },
    });
    // 예외처리
    if (!resume) {
      throw new HttpException('Not found resume', HttpStatus.NOT_FOUND);
    }
    // 삭제
    this.resumeRepository.remove(resume);
    return HttpStatus.OK;
  }
}
