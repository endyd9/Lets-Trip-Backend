import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { Post } from './posts/entities/post.entity';
import { CommentsModule } from './comments/comments.module';
import { Comment } from './comments/entities/comment.entity';
import { AuthMiddleware } from './auth/auth-user.middleware';
import { Reply } from './comments/entities/reply.entity';

import { BoardsModule } from './boards/boards.module';
import { Board } from './boards/entities/border.entity';
import { LikeModule } from './like/like.module';
import { Like } from './like/entities/like.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.dev.env' : '.prod.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      synchronize: true,
      logging: process.env.NODE_ENV === 'dev',
      entities: [User, Post, Comment, Reply, Board, Like],
    }),
    TypeOrmModule.forFeature([User, Post]),
    JwtModule.register({
      global: true,
      secret: process.env.TOKEN_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
    UsersModule,
    AuthModule,
    PostsModule,
    CommentsModule,
    BoardsModule,
    LikeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '/*', method: RequestMethod.ALL });
  }
}
