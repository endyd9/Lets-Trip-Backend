import { IsOptional, IsString } from 'class-validator';
import { Board } from 'src/boards/entities/border.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Like } from 'src/like/entities/like.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany, RelationId } from 'typeorm';

@Entity()
export class Post extends CoreEntity {
  @ManyToOne((type) => Board, (Board) => Board.posts, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  board: Board;

  @RelationId((post: Post) => post.board)
  boardId: number;

  @IsString()
  @Column({ length: 50 })
  title: string;

  @IsString()
  @Column({ length: 3000 })
  content: string;

  @IsString()
  @IsOptional()
  @Column({ nullable: true })
  imgUrl?: string;

  @ManyToOne((type) => User, (User) => User.posts, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  writer?: User;

  @Column({ nullable: true })
  searchName: string;

  @OneToMany((type) => Comment, (Comment) => Comment.post)
  comments: Comment[];

  @OneToMany((type) => Like, (like) => like.post)
  like: Like[];

  // @RelationId((post: Post) => post.like)
  // likeId: number;

  @Column({ default: 0 })
  view: number;

  @Column({ nullable: true })
  nomem: string;

  @Column({ nullable: true })
  password?: string;
}
