import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Like } from './entities/like.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like) private readonly like: Repository<Like>,
  ) {}

  async isLike(postId: number, user: User) {
    try {
      const isLike = Boolean(
        await this.like.findOne({
          where: {
            user: {
              id: user.id,
            },
            post: {
              id: postId,
            },
          },
        }),
      );

      return {
        ok: true,
        isLike,
      };
    } catch (error) {
      console.log(error);

      return {
        ok: false,
        error,
      };
    }
  }

  async changeState(postId: number, user: User) {
    try {
      const like = await this.like.findOne({
        where: {
          user: {
            id: user.id,
          },
          post: {
            id: postId,
          },
        },
      });
      if (!like) {
        const newLike = await this.like.save(
          await this.like.create({
            user: {
              id: user.id,
            },
            post: {
              id: postId,
            },
          }),
        );
        return {
          ok: true,
        };
      }
      await this.like.remove(like);
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
      };
    }
  }
}
