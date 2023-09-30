import { InternalServerErrorException } from '@nestjs/common';
import { IsString } from 'class-validator';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity()
export class User {
  @Column({ unique: true })
  @PrimaryGeneratedColumn()
  uid: number;

  @IsString()
  @Column({ unique: true })
  email: string;

  @IsString()
  @Column()
  password: string;

  @IsString()
  @Column({ default: `아무개` })
  nickName: string;

  @IsString()
  @Column({ default: null, nullable: true })
  avatarUrl?: string;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10);
      } catch (error) {
        console.log(error);
        throw new InternalServerErrorException();
      }
    }
  }
  async checkPassword(aPsassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(aPsassword, this.password);
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
