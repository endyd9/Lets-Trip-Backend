import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EditUserInput } from './dto/edit-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
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

  async update(id: number, { password, nickName, avatarUrl }: EditUserInput) {
    try {
      const user = await this.users.findOne({ where: { id } });
      if (!user) {
        throw new HttpException('유저없음', HttpStatus.NOT_FOUND);
      }
      user.password = password;
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
}
