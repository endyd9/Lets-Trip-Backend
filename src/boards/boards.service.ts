import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './entities/border.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateBoardInput, CreateBoardOutput } from './dto/create-board.dto';
import { EditBoardInput, EditBoardOutput } from './dto/edit-board.dto';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board) private readonly board: Repository<Board>,
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
