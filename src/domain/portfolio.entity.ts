import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Resume } from './resume.entity';

@Entity()
export class Portfolio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'resume_id' })
  resumeId: number;

  @Column({ type: 'varchar', comment: '링크' })
  address: string;

  @Column({ type: 'varchar', comment: '파일' })
  file: string;

  @ManyToOne(() => Resume, (resume) => resume.portfolio, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  resume: Resume;
}
