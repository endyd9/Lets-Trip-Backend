import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserInput, CreateUserOutput } from './users/dto/create-user.dto';
import { LoginInput, LoginOutput } from './users/dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private jwtService: JwtService,
  ) {}

  getHomeData(): string {
    return '메인화면 데이타 뿌려줄거임';
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
      await this.users.save(
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
        throw new HttpException('가입안된이메일', HttpStatus.NOT_FOUND);
      }
      const passwordCheck = await user.checkPassword(password);
      if (!passwordCheck) {
        throw new HttpException('비번틀림', HttpStatus.NOT_FOUND);
      }

      const payload = { id: user.id, username: user.email };
      const token = await this.jwtService.signAsync(payload);
      return {
        ok: true,
        token,
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
