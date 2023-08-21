import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Resume } from './resume.entity';
import { educationType } from 'commons/education.enums';

@Entity()
export class Education {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'resume_id' })
  resumeId: number;

  @Column({ type: 'varchar', length: 100, comment: '학교이름' })
  schoolTitle: string;

  @Column({ type: 'varchar', length: 10, comment: '입학년도' })
  admissionYear: string;

  @Column({ type: 'varchar', length: 10, comment: '졸업년도' })
  graduationYear: string;

  @Column({ type: 'varchar', length: 50, comment: '전공/계열' })
  major: string;

  @Column({
    type: 'enum',
    enum: educationType,
    comment: '학력구분',
  })
  education: educationType;

  @CreateDateColumn({ name: 'create_at', comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'update_at', comment: '수정일' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'delete_at', comment: '삭제일' })
  deletedAt?: Date | null;

  /**
   * 1 : M 관계 설정
   * @ManyToOne -> 해당 엔티티(Education) To 대상 엔티티(User)
   *               하나의 유저가 여러 학력을 보유
   */

  @ManyToOne(() => User, (user) => user.educations)
  user: User;

  // 이력서 연결
  @ManyToOne(() => Resume, (resume) => resume.education)
  resume: Resume;
}
