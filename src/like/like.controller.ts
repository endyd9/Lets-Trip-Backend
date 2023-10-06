import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { LikeService } from './like.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @UseGuards(AuthGuard)
  @Get('/:postId')
  isLiked(@Param() { postId }: { postId: string }, @AuthUser() user: User) {
    return this.likeService.isLike(+postId, user);
  }
  @UseGuards(AuthGuard)
  @Post('/:postId')
  create(@Param() { postId }: { postId: string }, @AuthUser() user: User) {
    return this.likeService.changeState(+postId, user);
  }
}
