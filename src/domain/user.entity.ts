import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { Education } from '../domain/education.entity';
import { Chat } from './chat.entity';
import { Applicant } from './applicant.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, comment: '유저아이디' })
  email: string;

  @Column({ type: 'varchar', length: 150, comment: '패스워드' })
  password: string;

  @Column({ type: 'varchar', length: 30, comment: '유저 이름' })
  name: string;

  @Column({ type: 'varchar', length: 30, comment: '전화번호' })
  phone: string;

  @Column({ type: 'char', length: 1, comment: '성별' })
  gender: string;

  @Column({ type: 'varchar', length: 255, comment: '주소' })
  address: string;

  @Column({ type: 'varchar', length: 10, comment: '생일' })
  birth: string;

  @CreateDateColumn({ name: 'create_at', comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'update_at', comment: '수정일' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'delete_at', comment: '삭제일' })
  deletedAt?: Date | null;

  /**
   * 1 : M 관계 설정
   * @OneToMany -> 해당 엔티티(Education) To 대상 엔티티 (User)
   */

  @OneToMany(() => Education, (education) => education.user)
  educations: Education[];

  //1:N 관계 설정 - 채팅
  @OneToMany(() => Chat, (chat) => chat.user)
  chat: Chat[];

  //1:N 관계 설정 - 지원내역
  @OneToMany(() => Applicant, (applicant) => applicant.user)
  applicant: Applicant[];
}
