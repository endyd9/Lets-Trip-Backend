import { IsBoolean, IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Post } from 'src/posts/entities/post.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Board extends CoreEntity {
  @IsString()
  @Column()
  name: string;

  @ManyToOne((type) => User, (User) => User.managedBoard, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  manager: User;

  @OneToMany((type) => Post, (Post) => Post.board, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  posts: Post[];

  @IsBoolean()
  @Column()
  approve: boolean;
}
