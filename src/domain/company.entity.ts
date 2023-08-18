import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import { Jobposting } from './jobposting.entity';

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, comment: '이메일' })
  email: string;

  @Column({ type: 'varchar', length: 150, comment: '패스워드' })
  password: string;

  @Column({ type: 'varchar', length: 30, comment: '회사명' })
  companyTitle: string;

  @Column({ type: 'varchar', length: 255, comment: '소개' })
  introduction: string;

  @Column({ type: 'varchar', length: 255, comment: '웹사이트' })
  website: string;

  @Column({ type: 'varchar', length: 255, comment: '본사 주소' })
  address: string;

  @Column({ type: 'varchar', length: 255, comment: '업계' })
  business: string;

  @Column({ type: 'int', comment: '직원수' })
  employees: number;

  @CreateDateColumn({ name: 'create_at', comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'update_at', comment: '수정일' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'delete_at', comment: '삭제일' })
  deletedAt?: Date | null;

  //1:N 관계 설정
  @ManyToOne(() => Jobposting, (jobposting) => jobposting.company)
  jobposting: Jobposting[];
}
