import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async use(req: Request, _, next: NextFunction) {
    if ('token' in req.headers) {
      try {
        const token = req.headers['token'];
        const { id } = await this.jwtService.verifyAsync(token.toString());
        if (id) {
          console.log('디비조회함');
          const { user, ok } = await this.usersService.me(+id);
          if (ok) {
            req['user'] = user;
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    next();
  }
}
