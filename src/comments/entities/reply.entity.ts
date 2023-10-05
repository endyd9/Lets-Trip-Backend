import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { Comment } from './comment.entity';
import { User } from 'src/users/entities/user.entity';
import { IsOptional, IsString } from 'class-validator';

@Entity()
export class Reply extends CoreEntity {
  @ManyToOne((type) => Comment, (Comment) => Comment.reply, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  comment: Comment;

  @RelationId((reply: Reply) => reply.comment)
  commentId: number;

  @ManyToOne((type) => User, (user) => user.reply, {
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
}
