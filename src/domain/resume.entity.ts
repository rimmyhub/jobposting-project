import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Aboutme } from './aboutme.entity';
import { Portfolio } from './portfolio.entity';
import { Career } from './career.entity';
import { Education } from './education.entity';
import { User } from './user.entity';

@Entity()
export class Resume {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', comment: '해당 이력서의 유저 아이디' })
  userId: number;

  @Column({ type: 'varchar', length: 100, comment: '이력서제목' })
  title: string;

  @Column({ type: 'varchar', length: 100, comment: '이력서내용' })
  content: string;

  @CreateDateColumn({ name: 'create_at', comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'update_at', comment: '수정일' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'delete_at', comment: '삭제일' })
  deletedAt?: Date | null;

  // 1:N관계설정 - 자기소개
  @OneToMany(() => Aboutme, (aboutme) => aboutme.resume)
  aboutme: Aboutme[];

  // 1:N관계설정 - 포트 폴리오
  @OneToMany(() => Portfolio, (portfolio) => portfolio.resume)
  portfolio: Portfolio[];

  // 1:N관계설정 - 경력
  @OneToMany(() => Career, (career) => career.resume)
  career: Career[];

  // 1:N관계설정 - 학력
  @OneToMany(() => Education, (education) => education.resume)
  education: Education[];

  // 1대1 유저 -- 이력서
  @OneToOne((type) => User)
  @JoinColumn()
  user: User;
  // @OneToOne(() => User, (user) => user.resume, {
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE',
  // })
  // user: User;
}
