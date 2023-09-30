import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserInput, CreateUserOutput } from './users/dto/create-user.dto';
import { LoginInput, LoginOutput } from './users/dto/login.dto';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async join({
    email,
    password,
    nickName,
    avatarUrl,
  }: CreateUserInput): Promise<CreateUserOutput> {
    try {
      const exists = Boolean(
        await this.users.findOne({
          where: { email },
        }),
      );
      if (exists) {
        throw new HttpException('이메일 중복', HttpStatus.BAD_REQUEST);
      }
      const user = await this.users.save(
        this.users.create({
          email,
          password,
          nickName,
          avatarUrl,
        }),
      );
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

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.users.findOne({ where: { email: email } });
      if (!user) {
        throw new HttpException('없는유저', HttpStatus.NOT_FOUND);
      }
      const passwordCheck = await user.checkPassword(password);
      if (!passwordCheck) {
        throw new HttpException('비번틀림', HttpStatus.NOT_FOUND);
      }
      return {
        ok: true,
        token: '나중에는 토큰 줄거임',
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
}
