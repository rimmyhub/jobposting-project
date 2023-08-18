import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Company } from './company.entity';

@Entity()
export class Jobposting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  companyId: string;

  @Column({ type: 'varchar', length: 255, comment: '제목' })
  title: string;

  @Column({ type: 'varchar', length: 150, comment: '경력' })
  career: string;

  @Column({ type: 'varchar', length: 150, comment: '급여' })
  salary: string;

  @Column({ type: 'varchar', length: 255, comment: '학력' })
  education: string;

  @Column({ type: 'varchar', length: 150, comment: '직무' })
  job: string;

  @Column({ type: 'varchar', length: 150, comment: '근무 형태' })
  workType: string;

  @Column({ type: 'varchar', length: 255, comment: '근무 지역' })
  workArea: string;

  @Column({ type: 'varchar', comment: '채용 공고 내용' })
  content: string;

  @Column({ type: 'date', comment: '채용 마감일' })
  Deadline: Date;

  @CreateDateColumn({ name: 'create_at', comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'update_at', comment: '수정일' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'delete_at', comment: '삭제일' })
  deletedAt?: Date | null;

  //1:N 관계 설정
  @ManyToOne(() => Company, (company) => company.jobposting)
  company: Company[];
}
