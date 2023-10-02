import { InternalServerErrorException } from '@nestjs/common';
import { IsOptional, IsString } from 'class-validator';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Post } from 'src/posts/entities/post.entity';

@Entity()
export class User extends CoreEntity {
  @IsString()
  @Column({ unique: true })
  email: string;

  @IsString()
  @Column()
  password: string;

  @IsString()
  @IsOptional()
  @Column({ default: `아무개` })
  nickName: string;

  @IsString()
  @IsOptional()
  @Column({ default: null, nullable: true })
  avatarUrl: string;

  @OneToMany((type) => Post, (Post) => Post.writer)
  posts: Post[];

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
