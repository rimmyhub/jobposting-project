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
import { Chat } from './chat.entity';
import { Applicant } from './applicant.entity';
import { Resume } from './resume.entity';
import { Comment } from './comment.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Education } from './education.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: '유저ID' })
  id: string;

  @Column({ type: 'varchar', length: 50, comment: '유저아이디' })
  @ApiProperty({ description: '유저아이디' })
  email: string;

  @Column({ type: 'varchar', length: 150, comment: '패스워드' })
  @ApiProperty({ description: '패스워드' })
  password: string;

  @Column({ type: 'text', comment: '사용자 이미지' })
  @ApiProperty({ description: '사용자 이미지' })
  image: string;

  @Column({ type: 'varchar', length: 30, comment: '유저 이름' })
  @ApiProperty({ description: '유저 이름' })
  name: string;

  @Column({ type: 'varchar', length: 30, comment: '전화번호' })
  @ApiProperty({ description: '전화번호' })
  phone: string;

  @Column({ type: 'char', length: 1, comment: '성별' })
  @ApiProperty({ description: '성별' })
  gender: string;

  @Column({ type: 'varchar', length: 255, comment: '주소' })
  @ApiProperty({ description: '주소' })
  address: string;

  @Column({ type: 'varchar', length: 10, comment: '생일' })
  @ApiProperty({ description: '생일' })
  birth: string;

  // 인증 번호
  @Column({ type: 'varchar', length: 10, comment: '인증번호' })
  @ApiProperty({ description: '인증번호' })
  verificationCode: string;

  // 인증이 완료되면 true로 변경
  @Column({ default: false })
  @ApiProperty({ description: '인증여부' })
  isVerified: boolean;

  @CreateDateColumn({ name: 'create_at', comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'update_at', comment: '수정일' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'delete_at', comment: '삭제일' })
  deletedAt?: Date | null;

  // refreshToken저장하기
  @Column({ nullable: true })
  @ApiProperty({ description: '토큰' })
  currentRefreshToken: string;

  @Column({ type: 'datetime', nullable: true })
  @ApiProperty({ description: '토큰' })
  currentRefreshTokenExp: Date;

  /**
   * 1 : M 관계 설정
   * @OneToMany -> 해당 엔티티(Education) To 대상 엔티티 (User)
   */

  @OneToMany(() => Education, (education) => education.user)
  educations: Education[];

  //1대다 관계 설정 - 채팅
  @OneToMany(() => Chat, (chat) => chat.user)
  chat: Chat[];

  //1:N 관계 설정 - 지원내역
  @OneToMany(() => Applicant, (applicant) => applicant.user)
  applicant: Applicant[];

  // 1대1관계 이력서 -- 유저
  @OneToOne((type) => Resume)
  @JoinColumn()
  resume: Resume;

  @OneToMany(() => Comment, (comment) => comment.user)
  comment: Comment[];
}
