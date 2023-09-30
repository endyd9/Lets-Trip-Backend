import { IsString } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @Column({ unique: true })
  @PrimaryGeneratedColumn()
  uid: number;

  @IsString()
  @Column({ unique: true })
  email: string;

  @IsString()
  password: string;

  @IsString()
  @Column({ default: `아무개` })
  nickName: string;

  @IsString()
  @Column({ default: null, nullable: true })
  avatarUrl?: string;
}
