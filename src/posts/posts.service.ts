import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EditPostInput, EditPostOutput } from './dto/edit-post.dto';
import { DeletePostInput, DeletePostOutput } from './dto/delete-post.dto';
import { User } from 'src/users/entities/user.entity';
import { PostsOutput } from 'src/boards/dto/posts.dto';
import { GetCommentsInput, GetCommentsOutput } from './dto/get-comments.dto';
import { Comment } from 'src/comments/entities/comment.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly post: Repository<Post>,
    @InjectRepository(Comment) private readonly comment: Repository<Comment>,
  ) {}

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

  async getPost(id: string) {
    try {
      const post = await this.post.findOne({
        where: {
          id: +id,
        },
        select: {
          writer: {
            id: true,
            nickName: true,
            avatarUrl: true,
          },
        },
        relations: ['writer'],
      });
      if (!post) {
        throw new HttpException('글없음', HttpStatus.NOT_FOUND);
      }
      post.view = post.view + 1;
      await this.post.save(post);
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

  async getComments(
    postId: string,
    getCommentsInput: GetCommentsInput,
  ): Promise<GetCommentsOutput> {
    let page = 1;
    try {
      if (getCommentsInput.page) {
        page = +getCommentsInput.page;
      }
      const comments = await this.comment.find({
        where: {
          post: {
            id: +postId,
          },
        },
        select: {
          id: true,
          createdAt: true,
          content: true,
          nomem: true,
          password: true,
          reply: {
            id: true,
            content: true,
            writer: {
              createdAt: true,
              id: true,
              nickName: true,
              avatarUrl: true,
            },
            nomem: true,
            password: true,
          },
          writer: {
            id: true,
            nickName: true,
            avatarUrl: true,
          },
        },
        order: {
          createdAt: 'DESC',
        },
        relations: ['writer', 'reply', 'reply.writer'],
        skip: (+page - 1) * 10,
        take: 10,
      });
      return {
        ok: true,
        comments,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error,
      };
    }
  }
}
