import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
// import { Company } from './company.entity';
// import { Career } from './career.entity';
// import { User } from './user.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', comment: '제목' })
  title: string;

  @Column({ type: 'varchar', comment: '내용' })
  comment: string;

  @Column({ type: 'int', comment: '평점' })
  star: number;

  @CreateDateColumn({ name: 'create_at', comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'update_at', comment: '수정일' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'delete_at', comment: '삭제일' })
  deletedAt?: Date | null;

  // @ManyToOne(() => Company, (company) => company.comments)
  // company: Company;

  // @ManyToOne(() => Career, (career) => career.comments)
  // career: Career;

  // @ManyToOne(() => User, (user) => user.comments)
  // user: User;
}
