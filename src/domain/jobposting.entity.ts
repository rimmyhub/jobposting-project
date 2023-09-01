import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Company } from './company.entity';
import { Applicant } from './applicant.entity';

@Entity()
export class Jobposting {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'company_id' })
  companyId: number;

  @Column({ type: 'varchar', comment: '채용 공고 제목' })
  title: string;

  @Column({ type: 'varchar', comment: '경력' })
  career: string;

  @Column({ type: 'varchar', comment: '급여' })
  salary: string;

  @Column({ type: 'varchar', comment: '학력' })
  education: string;

  @Column({ type: 'varchar', comment: '근무 형태' })
  workType: string;

  @Column({ type: 'varchar', comment: '근무 지역' })
  workArea: string;

  @Column({ type: 'text', comment: '채용 공고 내용' })
  content: string;

  @Column({ type: 'varchar', comment: '채용 마감일' })
  dueDate: Date;

  @CreateDateColumn({ name: 'create_at', comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'update_at', comment: '수정일' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'delete_at', comment: '삭제일' })
  deletedAt?: Date | null;

  // 1:N 관계 설정 - 회사
  @ManyToOne(() => Company, (company) => company.jobposting)
  company: Company;

  // 1:N 관계 설정 - 지원하기
  @OneToMany(() => Applicant, (applicant) => applicant.jobposting)
  applicant: Applicant[];
}
