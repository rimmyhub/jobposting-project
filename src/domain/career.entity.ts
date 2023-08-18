import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
// import { Resume } from './resume.entity';

@Entity()
export class Career {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', comment: '회사이름' })
  companyTitle: string;

  @Column({ type: 'varchar', comment: '직무' })
  job: string;

  @Column({ type: 'varchar', comment: '입사날짜' })
  joiningDate: string;

  @Column({ type: 'varchar', comment: '퇴사날짜' })
  resignationDate: string;

  @Column({ type: 'varchar', comment: '직책' })
  position: string;

  @CreateDateColumn({ name: 'create_at', comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'update_at', comment: '수정일' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'delete_at', comment: '삭제일' })
  deletedAt?: Date | null;

  //   @ManyToOne(() => Resume, (resume) => resume.careers)
  //   resume: Resume;
}
