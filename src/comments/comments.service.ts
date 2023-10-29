import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { WriteCommentInput, WriteCommentOutput } from './dto/write-comment.dto';
import { Post } from 'src/posts/entities/post.entity';
import { EditCommentInput, EditCommentOutput } from './dto/edit-comment.dto';
import { User } from 'src/users/entities/user.entity';
import {
  DeleteCommentInput,
  DeleteCommentOutput,
} from './dto/delete-comment.dto';
import { WriteReplyInput, WriteReplyOutput } from './dto/write-reply.dto';
import { Reply } from './entities/reply.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment) private readonly comment: Repository<Comment>,
    @InjectRepository(Post) private readonly post: Repository<Comment>,
    @InjectRepository(Reply) private readonly reply: Repository<Reply>,
  ) {}

  //댓글

  async writeComment(
    postId: string,
    { nomem, password, content }: WriteCommentInput,
    user: User,
  ): Promise<WriteCommentOutput> {
    let newComment: Comment;
    try {
      if (!nomem && !user) {
        throw new HttpException('권한 없음', HttpStatus.FORBIDDEN);
      }
      const post = await this.post.findOne({ where: { id: +postId } });
      if (!post) {
        throw new HttpException('없는 게시글', HttpStatus.BAD_REQUEST);
      }
      if (content?.length > 200) {
        throw new HttpException(
          '댓글 글자수 제한 넘김',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (nomem?.length > 20 || password?.length > 20) {
        throw new HttpException(
          '닉네임 || 비밀번호 글자수 제한 넘김',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (user !== undefined) {
        newComment = this.comment.create({
          writer: user,
          content,
          post,
        });
      } else if (nomem !== undefined && password !== undefined) {
        newComment = this.comment.create({
          nomem,
          password,
          content,
          post,
        });
      } else {
        throw new HttpException('작성자 오류', HttpStatus.BAD_REQUEST);
      }

      await this.comment.save(newComment);

      return {
        ok: true,
        newComment,
      };
    } catch (error) {
      console.log(error);

      return {
        ok: false,
        error,
      };
    }
  }

  async editComment(
    commentId: string,
    { password, content }: EditCommentInput,
    user: User,
  ): Promise<EditCommentOutput> {
    try {
      if (user === undefined && password === undefined) {
        throw new HttpException('권한 없음', HttpStatus.FORBIDDEN);
      }

      const comment = await this.comment.findOne({
        where: { id: +commentId },
        relations: ['writer'],
      });
      if (!comment) {
        throw new HttpException('댓글 없음', HttpStatus.NOT_FOUND);
      }

      if (comment.writer) {
        if (comment.writer.id !== user.id) {
          throw new HttpException('권한 없음', HttpStatus.FORBIDDEN);
        }
        comment.content = content;
      } else if (comment.nomem) {
        if (comment.password !== password) {
          throw new HttpException('권한 없음', HttpStatus.FORBIDDEN);
        }
        comment.content = content;
      }
      await this.comment.save(comment);
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

  async deleteComment(
    commentId: string,
    { password }: DeleteCommentInput,
    user: User,
  ): Promise<DeleteCommentOutput> {
    try {
      if (user === undefined && password === undefined) {
        throw new HttpException('권한 없음', HttpStatus.FORBIDDEN);
      }

      const comment = await this.comment.findOne({
        where: { id: +commentId },
        relations: ['writer'],
      });
      if (!comment) {
        throw new HttpException('댓글 없음', HttpStatus.NOT_FOUND);
      }

      if (comment.writer) {
        if (comment.writer.id !== user.id) {
          throw new HttpException('권한 없음', HttpStatus.FORBIDDEN);
        }
      } else if (comment.nomem) {
        if (comment.password !== password) {
          throw new HttpException('권한 없음', HttpStatus.FORBIDDEN);
        }
      }
      await this.comment.remove(comment);

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

  // 대댓글

  async writeReply(
    commentId: number,
    { nomem, password, content }: WriteReplyInput,
    user: User,
  ): Promise<WriteReplyOutput> {
    try {
      if (!nomem && !user) {
        throw new HttpException('작성자 정보 없음', HttpStatus.BAD_REQUEST);
      }
      if (content.length > 200) {
        throw new HttpException(
          '댓글 글자수 제한 넘김',
          HttpStatus.BAD_REQUEST,
        );
      }
      const comment = await this.comment.findOne({ where: { id: commentId } });
      if (!comment) {
        throw new HttpException('댓글 정보 없음', HttpStatus.BAD_REQUEST);
      }
      if (user) {
        await this.reply.save(
          this.reply.create({
            comment,
            writer: user,
            content,
          }),
        );
        return {
          ok: true,
        };
      } else if (nomem) {
        if (!password) {
          throw new HttpException('비밀번호 없음', HttpStatus.BAD_REQUEST);
        }
        if (nomem.length > 20 || password.length > 20) {
          throw new HttpException(
            '닉네임 || 비밀번호 글자수 제한 넘김',
            HttpStatus.BAD_REQUEST,
          );
        }
        await this.reply.save(
          this.reply.create({
            comment,
            nomem,
            password,
            content,
          }),
        );
        return {
          ok: true,
        };
      }
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async editReply(
    replyId: number,
    { content, password }: EditCommentInput,
    user: User,
  ): Promise<EditCommentOutput> {
    try {
      if (!user && !password) {
        throw new HttpException('작성자 정보 없음', HttpStatus.BAD_REQUEST);
      }
      if (content.length > 200) {
        throw new HttpException(
          '댓글 글자수 제한 넘김',
          HttpStatus.BAD_REQUEST,
        );
      }
      const reply = await this.reply.findOne({
        where: { id: replyId },
        relations: ['writer'],
      });

      if (!reply) {
        throw new HttpException('대댓글 정보 없음', HttpStatus.BAD_REQUEST);
      }

      if (user) {
        if (reply.writer.id !== user.id) {
          throw new HttpException('작성자 정보 불일치', HttpStatus.FORBIDDEN);
        }
      }

      if (password) {
        if (reply.password !== password) {
          throw new HttpException('비밀번호 불일치', HttpStatus.FORBIDDEN);
        }
      }

      reply.content = content;

      await this.reply.save(reply);

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

  async deleteReply(
    replyId: number,
    { password }: DeleteCommentInput,
    user: User,
  ): Promise<DeleteCommentOutput> {
    try {
      if ((!user && !password) || (user && password)) {
        throw new HttpException('작성자 정보 잘못됨', HttpStatus.BAD_REQUEST);
      }
      const reply = await this.reply.findOne({
        where: { id: replyId },
        relations: ['writer'],
      });

      if (!reply) {
        throw new HttpException('대댓글 정보 없음', HttpStatus.BAD_REQUEST);
      }

      if (!user) {
        if (reply.password !== password) {
          throw new HttpException('비밀번호 불일치', HttpStatus.FORBIDDEN);
        }
      }

      if (!password) {
        if (reply.writer.id !== user.id) {
          throw new HttpException('작성자 정보 불일치', HttpStatus.FORBIDDEN);
        }
      }

      await this.reply.remove(reply);

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
