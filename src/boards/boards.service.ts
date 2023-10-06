import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './entities/border.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateBoardInput, CreateBoardOutput } from './dto/create-board.dto';
import { EditBoardInput, EditBoardOutput } from './dto/edit-board.dto';
import { PostInput, PostOutput } from './dto/post.dto';
import { Post } from 'src/posts/entities/post.entity';
import { PostsInput, PostsOutput } from './dto/posts.dto';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board) private readonly board: Repository<Board>,
    @InjectRepository(Post) private readonly post: Repository<Post>,
  ) {}

  async getAll() {
    try {
      const boards = await this.board.find({
        where: {
          approve: true,
        },
        select: ['id', 'name'],
      });
      return {
        ok: true,
        boards,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async create(
    { name }: CreateBoardInput,
    user: User,
  ): Promise<CreateBoardOutput> {
    const exist = await this.board.findOne({ where: { name } });
    if (exist) {
      throw new HttpException('게시판명 중복', HttpStatus.BAD_REQUEST);
    }
    await this.board.save(
      this.board.create({
        name,
        manager: user,
      }),
    );
    try {
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

  async getPosts(boardId: number, query: PostsInput): Promise<PostsOutput> {
    console.log(query);

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
      if (!query.sort) {
        order = {
          createdAt: 'DESC',
        };
      } else {
        switch (query.sort.replaceAll('"', '').replaceAll("'", '')) {
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
          // case 'like':
          //   order = {
          //     like: 'DESC',
          //   };
          //   break;
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
        where: {
          board: {
            id: boardId,
          },
        },
        select: {
          id: true,
          writer: {
            nickName: true,
          },
          nomem: true,
          title: true,
          createdAt: true,
        },
        relations: ['writer'],
        take: limit,
        skip: (page - 1) * limit,
        order,
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
    boardId: number,
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
            board: {
              id: boardId,
            },
            title,
            content,
            imgUrl,
            writer: user,
          }),
        );
      } else if (nomem !== undefined) {
        post = await this.post.save(
          this.post.create({
            board: {
              id: boardId,
            },
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
      console.log(error);

      return {
        ok: false,
        error,
      };
    }
  }

  async edit(
    id: number,
    { name }: EditBoardInput,
    user: User,
  ): Promise<EditBoardOutput> {
    try {
      const board = await this.board.findOne({
        where: { id },
        relations: ['manager'],
      });
      if (!board) {
        throw new HttpException('게시판 정보 없음', HttpStatus.NOT_FOUND);
      }
      if (board.manager.id !== user.id) {
        throw new HttpException('매니저 정보 불일치', HttpStatus.FORBIDDEN);
      }
      const exist = await this.board.findOne({ where: { name } });
      if (exist) {
        throw new HttpException('게시판명 중복', HttpStatus.BAD_REQUEST);
      }
      board.name = name;
      await this.board.save(board);
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

  async delete(id: number, user: User) {
    try {
      const board = await this.board.findOne({
        where: { id },
        relations: ['manager'],
      });
      if (board.manager.id !== user.id) {
        throw new HttpException('매니저 정보 불일치', HttpStatus.FORBIDDEN);
      }
      await this.board.remove(board);
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

  async confirm(id: number, user: User) {
    try {
      /* 
     승인 자격 있는지 검사 할 로직
    */
      const board = await this.board.findOne({ where: { id } });

      if (!board) {
        throw new HttpException('게시판 정보 없음', HttpStatus.NOT_FOUND);
      }
      if (board.approve === true) {
        return {
          ok: false,
          error: '이미 승인된 게시판입니다.',
        };
      }

      board.approve = true;

      await this.board.save(board);
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
