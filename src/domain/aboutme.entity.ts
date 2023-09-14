import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Resume } from './resume.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Aboutme {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'aboutMeId' })
  id: number;

  @Column({ name: 'resume_id' })
  @ApiProperty({ description: 'resumeId' })
  resumeId: number;

  @Column({ type: 'varchar', length: 255, comment: '제목' })
  @ApiProperty({ description: '자기소개서 제목' })
  title: string;

  @Column({ type: 'text', comment: '내용' }) //longtext
  @ApiProperty({ description: '자기소개서 내용' })
  content: string;

  // 1:N 관계설정 - 이력서
  @ManyToOne(() => Resume, (resume) => resume.aboutme, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  resume: Resume;
}
