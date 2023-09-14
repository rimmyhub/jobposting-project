import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Company } from './company.entity';
import { Applicant } from './applicant.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Jobposting {
  @PrimaryGeneratedColumn('increment')
  @ApiProperty({ description: '채용공고ID' })
  id: number;

  @Column({ name: 'company_id' })
  @ApiProperty({ description: '회사ID' })
  companyId: string;

  @Column({ type: 'varchar', comment: '채용 공고 제목' })
  @ApiProperty({ description: '제목' })
  title: string;

  @Column({ type: 'varchar', comment: '경력' })
  @ApiProperty({ description: '경력' })
  career: string;

  @Column({ type: 'varchar', comment: '급여' })
  @ApiProperty({ description: '급여' })
  salary: string;

  @Column({ type: 'varchar', comment: '학력' })
  @ApiProperty({ description: '학력' })
  education: string;

  @Column({ type: 'text', comment: '직무' })
  @ApiProperty({ description: '직무' })
  job: string;

  @Column({ type: 'varchar', comment: '근무 형태' })
  @ApiProperty({ description: '근무 형태' })
  workType: string;

  @Column({ type: 'varchar', comment: '근무 지역' })
  @ApiProperty({ description: '근무 지역' })
  workArea: string;

  @Column({ type: 'text', comment: '채용 공고 내용' })
  @ApiProperty({ description: '채용 공고 내용' })
  content: string;

  @Column({ type: 'varchar', comment: '채용 마감일' })
  @ApiProperty({ description: '채용 마감일' })
  dueDate: Date;

  @CreateDateColumn({ name: 'create_at', comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'update_at', comment: '수정일' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'delete_at', comment: '삭제일' })
  deletedAt?: Date | null;

  // 1:N 관계 설정 - 회사
  @ManyToOne(() => Company, (company) => company.jobposting, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  company: Company;

  // 1:N 관계 설정 - 지원하기
  @OneToMany(() => Applicant, (applicant) => applicant.jobposting)
  applicant: Applicant[];
}
