import { IsOptional, IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Post } from 'src/posts/entities/post.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';

@Entity()
export class Comment extends CoreEntity {
  @ManyToOne((type) => User, (user) => user.comments, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  writer?: User;

  @IsString()
  @IsOptional()
  @Column({ length: 20, nullable: true })
  nomem?: string;

  @IsString()
  @IsOptional()
  @Column({ length: 20, nullable: true })
  password?: string;

  @IsString()
  @Column({ length: 200 })
  content: string;

  @Column({ default: 0 })
  like: number;

  @ManyToOne((type) => Post, (Post) => Post.comments, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  post: Post;

  @RelationId((comment: Comment) => comment.post)
  postId: number;
}
