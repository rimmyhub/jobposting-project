import {
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Resume } from './resume.entity';

@Entity()
export class Aboutme {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'resume_id' })
  resumeId: number;

  @Column({ type: 'varchar', length: 255, comment: '제목' })
  title: string;

  @Column({ type: 'text', comment: '내용' }) //longtext
  content: string;

  @ManyToOne(() => Resume, (resume) => resume.aboutme)
  resume: Resume;
}
