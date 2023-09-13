import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Resume } from './resume.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Portfolio {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '포트폴리오ID' })
  id: number;

  @Column({ name: 'resume_id' })
  @ApiProperty({ description: '이력서ID' })
  resumeId: number;

  @Column({ type: 'varchar', comment: '링크' })
  @ApiProperty({ description: '링크' })
  address: string;

  @Column({ type: 'varchar', comment: '파일' })
  @ApiProperty({ description: '파일' })
  file: string;

  @ManyToOne(() => Resume, (resume) => resume.portfolio, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  resume: Resume;
}
