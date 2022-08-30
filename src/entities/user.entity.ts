import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { CreatedModified } from './created-at';

@Entity('users')
export class User extends CreatedModified {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ unique: true })
  @Index('index-user-email')
  email: string;

  @ApiProperty()
  @Column({ nullable: false })
  password: string;

  @ApiProperty()
  @Column({ default: false })
  is_email_verified: boolean;

  @ApiProperty()
  @Column({ default: false })
  is_blocked: boolean;

  @ApiProperty()
  @Column({ default: false, nullable: true })
  is_banned: boolean;

  @ApiProperty()
  @Column({ default: false })
  is_active: boolean;

  @ApiProperty()
  @Column({ nullable: true })
  otp: number;

  @ApiProperty()
  @Column({ type: 'float', nullable: true })
  otp_timestamp: number;

  @ApiProperty()
  @Column({ nullable: true, default: null })
  @Exclude({ toPlainOnly: true })
  password_reset_token: string;

  @ApiProperty()
  @Column({ type: 'float', default: 0 })
  password_reset_expires: number;

  @ApiProperty()
  @Column({ default: false })
  is_reset_pasword_otp_verified: boolean;

  @ApiProperty()
  @Column({ type: 'float', default: 0 })
  last_login_time: number;
}
