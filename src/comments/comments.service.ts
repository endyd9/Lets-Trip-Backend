import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { GetCommentsInput, GetCommentsOutput } from './dto/get-comments.dto';
import { WriteCommentInput, WriteCommentOutput } from './dto/write-comment.dto';
import { Post } from 'src/posts/entities/post.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment) private readonly comment: Repository<Comment>,
    @InjectRepository(Post) private readonly post: Repository<Comment>,
  ) {}

  async getComments(
    postId: string,
    { page }: GetCommentsInput,
  ): Promise<GetCommentsOutput> {
    try {
      const comments = await this.comment.find({
        where: {
          post: {
            id: +postId,
          },
        },
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

  async writeComment(
    postId: string,
    { writer, nomem, password, content }: WriteCommentInput,
  ): Promise<WriteCommentOutput> {
    try {
      const post = await this.post.findOne({ where: { id: +postId } });
      if (!post) {
        throw new HttpException('없는 게시글', HttpStatus.BAD_REQUEST);
      }
      if (content.length > 200) {
        throw new HttpException(
          '댓글 글자수 제한 넘김',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (nomem.length > 20 || password.length > 20) {
        throw new HttpException(
          '닉네임 || 비밀번호 글자수 제한 넘김',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (writer !== undefined) {
        await this.comment.save(
          this.comment.create({
            writer,
            content,
            post,
          }),
        );
        return {
          ok: true,
        };
      } else if (nomem !== undefined && password !== undefined) {
        await this.comment.save(
          this.comment.create({
            nomem,
            password,
            content,
            post,
          }),
        );
        return {
          ok: true,
        };
      } else {
        throw new HttpException('작성자 오류', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
}
