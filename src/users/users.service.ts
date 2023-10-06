import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EditUserInput } from './dto/edit-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { ChangePasswordOutput } from './dto/change-password.dto';
import { Post } from 'src/posts/entities/post.entity';
import { Like } from 'src/like/entities/like.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Post) private readonly post: Repository<Post>,
    @InjectRepository(Like) private readonly like: Repository<Like>,
  ) {}

  async findAll() {
    try {
      const users = await this.users.find();
      return {
        ok: true,
        users,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.users.findOne({
        where: {
          id,
        },
        select: ['nickName', 'avatarUrl', 'email'],
      });
      if (!user) {
        throw new HttpException('유저없음', HttpStatus.NOT_FOUND);
      }
      return {
        ok: true,
        user,
      };
    } catch (error) {
      console.log(error);

      return {
        ok: false,
        error,
      };
    }
  }

  async me(id: number) {
    try {
      const user = await this.users.findOne({
        where: {
          id,
        },
      });
      if (!user) {
        throw new HttpException('유저없음', HttpStatus.NOT_FOUND);
      }
      return {
        ok: true,
        user,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async update(id: number, { nickName, avatarUrl }: EditUserInput) {
    try {
      const user = await this.users.findOne({ where: { id } });
      if (!user) {
        throw new HttpException('유저없음', HttpStatus.NOT_FOUND);
      }
      user.nickName = nickName;
      user.avatarUrl = avatarUrl;

      await this.users.save(user);
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async remove(id: number) {
    try {
      const user = await this.users.findOne({ where: { id } });

      if (!user) {
        throw new HttpException('유저 없음', HttpStatus.BAD_REQUEST);
      }
      await this.users.remove(user);
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async changePassword(
    id: number,
    oldPassword: string,
    newPassword: string,
  ): Promise<ChangePasswordOutput> {
    try {
      const user = await this.users.findOne({ where: { id } });
      if (!user) {
        throw new HttpException('유저없음', HttpStatus.NOT_FOUND);
      }
      const passwordCheck = await user.checkPassword(oldPassword);
      console.log(passwordCheck);

      if (!passwordCheck) {
        throw new HttpException('비번틀림', HttpStatus.FORBIDDEN);
      }
      user.password = newPassword;

      await this.users.save(user);
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async getUsersWritePosts(userId: number) {
    try {
      const posts = await this.post.find({
        where: {
          writer: {
            id: userId,
          },
        },
        select: {
          id: true,
          title: true,
        },
      });
      return {
        ok: true,
        posts,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async getUsersLikedPosts(userId: number) {
    try {
      const posts = await this.post.find({
        where: {
          like: {
            user: {
              id: userId,
            },
          },
        },
        select: {
          id: true,
          title: true,
          writer: {
            nickName: true,
          },
          nomem: true,
        },
        relations: ['writer', 'like'],
      });
      posts.forEach((post: any) => {
        delete post.like;
        if (!post.writer) {
          post.writer = post.nomem;
          delete post.nomem;
        } else {
          delete post.nomem;
          post.writer = post.writer.nickName;
        }
      });
      return {
        ok: true,
        posts,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
}
