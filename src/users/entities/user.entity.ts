import { InternalServerErrorException } from '@nestjs/common';
import { IsEmail, IsString } from 'class-validator';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Post } from 'src/posts/entities/post.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Reply } from 'src/comments/entities/reply.entity';
import { Board } from 'src/boards/entities/border.entity';
import { Like } from 'src/like/entities/like.entity';

@Entity()
export class User extends CoreEntity {
  @IsEmail()
  @Column({ unique: true })
  email: string;

  @IsString()
  @Column()
  password: string;

  @IsString()
  @Column({ length: 20, default: `아무개` })
  nickName: string;

  @IsString()
  @Column({ default: null, nullable: true })
  avatarUrl?: string;

  @OneToMany((type) => Post, (Post) => Post.writer, { nullable: true })
  posts: Post[];

  @OneToMany((type) => Comment, (Comment) => Comment.writer, { nullable: true })
  comments: Comment[];

  @OneToMany((type) => Reply, (Reply) => Reply.writer, { nullable: true })
  reply: Reply[];

  @OneToMany((type) => Board, (board) => board.manager, { nullable: true })
  managedBoard: Board[];

  @OneToMany((type) => Like, (like) => like.user, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  likedPosts: Like[];

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
