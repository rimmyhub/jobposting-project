import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Resume } from 'src/domain/resume.entity';
import { LessThan, Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';

@Injectable()
// 해당 객체 export
export class ResumeService {
  // 생성자 함수 - 인스턴스 생성 시 실행 / 인자 추가 가능
  constructor(
    // 괄호안의 엔티티(모델)명을 가진 DB와 작업 진행
    @InjectRepository(Resume)
    private readonly resumeRepository: Repository<Resume>,
  ) {}

  // 소프트리무브 시킨 이력서가 시간이 지나면 자동으로 삭제 하는 로직
  @Cron('0 0 * * *') // 왼쪽 0부터 초, 분, 시, 일, 월, 요일
  async cleanupOldResumes() {
    // Date 타입의 데이터를 담고
    const oneDayAgo = new Date();
    // 담은 데이터에서 1일을 뺀 데이터를 세팅
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    // 1일 이전에 소프트리무브 시킨 이력서 삭제
    const cleanupTarget = await this.resumeRepository.find({
      where: {
        deletedAt: LessThan(oneDayAgo),
      },
    });
    // 완전 삭제시킬 cleanupTarget list에서 하나하나를 DB에서 삭제해준다.
    for (const resume of cleanupTarget) {
      await this.resumeRepository.delete(resume);
    }
  }

  // 이력서 - 작성 로직
  async createResume(
    id: number,
    createResumeDto: CreateResumeDto,
  ): Promise<Resume> {
    // Body
    const { title, content } = createResumeDto;
    // 예외처리
    if (!title || !content) {
      throw new HttpException(
        '양식에 알맞은 입력값을 넣어주세요.',
        HttpStatus.PRECONDITION_FAILED,
      );
    }
    // 유저의 이력서 내역 확인 후 예외처리
    const existResume = await this.resumeRepository.find({
      where: { userId: id },
    });
    if (existResume.length !== 0) {
      throw new HttpException(
        '이미 본인의 이력서를 보유하고 계십니다.',
        HttpStatus.CONFLICT,
      );
    }
    // 이력서 생성
    const resume = this.resumeRepository.create({
      userId: id,
      title,
      content,
    });
    // 예외처리
    if (!resume) {
      throw new HttpException('이력서 작성 실패', HttpStatus.BAD_REQUEST);
    }
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
      select: ['id', 'userId', 'title'],
    });
  }

  // 이력서 - 상세 조회
  async findOneResume(resumeId: number): Promise<Resume> {
    // 해당 이력서 조회
    const resume = await this.resumeRepository.findOne({
      where: { id: resumeId },
      select: ['userId', 'title', 'content'],
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
    // 예외처리
    if (!title && !content) {
      throw new HttpException(
        '수정할 부분의 내용을 입력해주세요.',
        HttpStatus.PRECONDITION_FAILED,
      );
    }
    // 제목 수정
    if (title !== undefined) {
      resume.title = title;
    }
    // 내용 수정
    if (content !== undefined) {
      resume.content = content;
    }
    // 수정한 이력서 저장
    await this.resumeRepository.save(resume);
    // 반환
    return resume;
  }

  // 이력서 - 삭제
  async removeResume(resumeId: number): Promise<object> {
    // 삭제할 이력서 확인
    const resume = await this.resumeRepository.findOne({
      where: { id: resumeId },
    });
    // 예외처리
    if (!resume) {
      throw new HttpException('Not found resume', HttpStatus.NOT_FOUND);
    }
    // SOFT_REMOVED 이력서
    const deletedResume = await this.resumeRepository.softRemove(resume);
    // 예외처리
    if (!deletedResume) {
      throw new HttpException('삭제에 실패하였습니다.', HttpStatus.BAD_REQUEST);
    }

    // 반환값
    return { message: `${deletedResume.title} 이력서가 삭제되었습니다.` };
  }
}
