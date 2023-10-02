import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Post extends CoreEntity {
  @IsString()
  @Column()
  title: string;

  @IsString()
  @Column()
  content: string;

  @Column({ nullable: true })
  imgUrl?: string;

  @ManyToOne((type) => User, (User) => User.posts, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  writer: User;

  // @OneToMany(type => Comment, (Comment) => Comment.post)
  // comments: Comment[]

  @Column({ default: 0 })
  like: number;

  @Column({ nullable: true })
  nomem: string;

  @Column({ nullable: true })
  password?: string;
}
