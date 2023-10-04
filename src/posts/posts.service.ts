import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PostsOutput, PostsInput } from './dto/posts.dto';
import { PostInput, PostOutput } from './dto/post.dto';
import { EditPostInput, EditPostOutput } from './dto/edit-post.dto';
import { CoreOutput } from 'src/common/dto/core.dto';
import { DeletePostInput, DeletePostOutput } from './dto/delete-post.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly post: Repository<Post>,
  ) {}

  async getPosts(query: PostsInput): Promise<PostsOutput> {
    try {
      let limit: number;
      let page: number;
      let order: object;

      if (!query.limit) {
        limit = 10;
      } else {
        limit = +query.limit;
      }
      if (!query.page) {
        page = 1;
      } else {
        page = +query.page;
      }
      if (!query.sortOption) {
        order = {
          createdAt: 'DESC',
        };
      } else {
        switch (query.sortOption.replaceAll('"', '').replaceAll("'", '')) {
          case 'title':
            order = {
              title: 'DESC',
            };
            break;
          case 'createdAt':
            order = {
              createdAt: 'DESC',
            };
            break;
          case 'like':
            order = {
              like: 'DESC',
            };
            break;
          case 'comment':
            order = {
              comment: 'DESC',
            };
            break;
          default:
            order = {
              createdAt: 'DESC',
            };
        }
      }

      const posts = await this.post.find({
        take: limit,
        skip: (page - 1) * limit,
        order,
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

  async popular(): Promise<PostsOutput> {
    try {
      const posts = await this.post.find({
        take: 10,
        order: {
          like: 'DESC',
        },
      });
      return {
        ok: true,
        posts,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error,
      };
    }
  }

  async uploadPost(
    { title, content, imgUrl, nomem, password }: PostInput,
    user: User,
  ): Promise<PostOutput> {
    try {
      if (user === undefined && nomem === undefined) {
        throw new HttpException('작성자 오류', HttpStatus.BAD_REQUEST);
      } else if (user !== undefined && nomem !== undefined) {
        throw new HttpException('작성자 오류', HttpStatus.BAD_REQUEST);
      }
      let post: Post;
      if (user !== undefined) {
        post = await this.post.save(
          this.post.create({
            title,
            content,
            imgUrl,
            writer: user,
          }),
        );
      } else if (nomem !== undefined) {
        post = await this.post.save(
          this.post.create({
            title,
            content,
            imgUrl,
            nomem,
            password,
          }),
        );
      }

      return {
        ok: true,
        postId: post.id,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async getPost(id: string) {
    try {
      const post = await this.post.findOne({
        where: {
          id: +id,
        },
        relations: ['writer'],
      });
      if (!post) {
        throw new HttpException('글없음', HttpStatus.NOT_FOUND);
      }
      return {
        ok: true,
        post,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async editPost(
    id: string,
    { title, content, imgUrl, password }: EditPostInput,
    user: User,
  ): Promise<EditPostOutput> {
    try {
      const post = await this.post.findOne({
        where: { id: +id },
        relations: ['writer'],
      });
      if (!post) {
        throw new HttpException('게시글 못찾음', HttpStatus.NOT_FOUND);
      }

      if (post.writer !== null) {
        if (!user || post.writer.id !== user.id) {
          throw new HttpException('유저정보 다름', HttpStatus.FORBIDDEN);
        }
      }

      if (post.password) {
        if (post.password !== password || password === undefined) {
          throw new HttpException('비밀번호 틀림', HttpStatus.FORBIDDEN);
        }
      }

      post.title = title;
      post.content = content;
      post.imgUrl = imgUrl;
      await this.post.save(post);

      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);

      return {
        ok: false,
        error,
      };
    }
  }

  async deletePost(
    id: string,
    { password }: DeletePostInput,
    user: User,
  ): Promise<DeletePostOutput> {
    try {
      const post = await this.post.findOne({
        where: { id: +id },
        relations: ['writer'],
      });

      if (!post) {
        throw new HttpException('게시글 없음', HttpStatus.NOT_FOUND);
      }
      if (post.writer !== null) {
        if (!user || post.writer.id !== user.id) {
          throw new HttpException('유저정보 다름', HttpStatus.FORBIDDEN);
        }
      }
      if (post.password) {
        if (post.password !== password) {
          throw new HttpException('비밀번호 틀림', HttpStatus.FORBIDDEN);
        }
      }

      await this.post.remove(post);
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
}
