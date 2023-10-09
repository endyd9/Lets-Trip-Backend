import { CoreEntity } from 'src/common/entities/core.entity';
import { Post } from 'src/posts/entities/post.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, ManyToOne } from 'typeorm';

@Entity()
export class Like extends CoreEntity {
  @ManyToOne((type) => User, (user) => user.likedPosts)
  user: User;

  @ManyToOne((type) => Post, (post) => post.like)
  post: Post;
}
