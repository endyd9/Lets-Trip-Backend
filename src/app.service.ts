import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { Like, Repository } from 'typeorm';
import { CreateUserInput, CreateUserOutput } from './users/dto/create-user.dto';
import { LoginInput, LoginOutput } from './users/dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { Post } from './posts/entities/post.entity';
import { SearchInput } from './users/dto/search.dto';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Post) private readonly post: Repository<Post>,
    private jwtService: JwtService,
  ) {}

  async getHomeData() {
    try {
      const mostLiked = await this.post
        .query(`SELECT "post"."id", "post"."imgUrl",
        (SELECT COUNT("like"."id") FROM "like" "like" WHERE "like"."postId" = "post"."id") AS "likes"
        FROM "post"
        where "post"."imgUrl" is Not Null order by likes DESC limit 3`);

      const newest = await this.post.find({
        order: {
          createdAt: 'desc',
        },
        take: 3,
        select: {
          id: true,
          createdAt: true,
          title: true,
          searchName: true,
        },
      });

      newest.forEach((post: any) => {
        post.nickName = post.searchName;
        delete post.searchName;
      });

      return {
        ok: true,
        mostLiked,
        newest,
      };
    } catch (error) {
      console.log(error);

      return {
        ok: false,
        error,
      };
    }
  }

  async join({
    email,
    password,
    nickName,
    avatarUrl,
  }: CreateUserInput): Promise<CreateUserOutput> {
    console.log(nickName, avatarUrl);

    try {
      const exists = Boolean(
        await this.users.findOne({
          where: { email },
        }),
      );
      if (exists) {
        throw new HttpException('중복된 이메일입니다.', HttpStatus.BAD_REQUEST);
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
        throw new HttpException('비번틀림', HttpStatus.UNAUTHORIZED);
      }

      const payload = { id: user.id, username: user.email };
      const token = await this.jwtService.signAsync(payload);
      return {
        ok: true,
        token,
        userId: user.id,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error,
      };
    }
  }

  async searchPosts({ type, keyword, page: pagePrams }: SearchInput) {
    let page: number;
    if (!pagePrams) {
      page = 1;
    } else {
      page = +pagePrams;
    }
    try {
      let posts: Post[];
      switch (type) {
        case 'title':
          posts = await this.post.find({
            where: {
              title: Like(`%${keyword}%`),
            },
            select: {
              id: true,
              nomem: true,
              writer: {
                nickName: true,
              },
            },
            relations: ['writer'],
            skip: (page - 1) * 10,
          });
          break;
        case 'content':
          posts = await this.post.find({
            where: {
              content: Like(`%${keyword}%`),
            },
            select: {
              id: true,
              nomem: true,
              writer: {
                nickName: true,
              },
            },
            relations: ['writer'],
            skip: (page - 1) * 10,
          });
          break;
        case 'writer':
          posts = await this.post.find({
            where: [
              {
                writer: {
                  nickName: Like(`%${keyword}%`),
                },
              },
              {
                nomem: Like(`%${keyword}%`),
              },
            ],
            select: {
              id: true,
              nomem: true,
              writer: {
                nickName: true,
              },
            },
            relations: ['writer'],
            skip: (page - 1) * 10,
          });
          break;
      }
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
}
