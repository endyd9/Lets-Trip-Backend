import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { EditPostInput, EditPostOutput } from './dto/edit-post.dto';
import { DeletePostInput, DeletePostOutput } from './dto/delete-post.dto';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { PostsOutput } from 'src/boards/dto/posts.dto';
import { GetCommentsInput, GetCommentsOutput } from './dto/get-comments.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Get('popular')
  popular(): Promise<PostsOutput> {
    return this.postService.popular();
  }

  @Get(':id')
  post(@Param() { id }) {
    return this.postService.getPost(id);
  }

  @Patch(':id')
  editPost(
    @Param() { id },
    @Body() editPostInput: EditPostInput,
    @AuthUser() user: User | undefined,
  ): Promise<EditPostOutput> {
    return this.postService.editPost(id, editPostInput, user);
  }

  @Delete(':id')
  deletePost(
    @Param() { id },
    @Body() deletePostInput: DeletePostInput,
    @AuthUser() user: User | undefined,
  ): Promise<DeletePostOutput> {
    return this.postService.deletePost(id, deletePostInput, user);
  }

  @Get(':postId/comments')
  getComments(
    @Param() { postId },
    @Query() getCommentsInput: GetCommentsInput,
  ): Promise<GetCommentsOutput> {
    return this.postService.getComments(postId, getCommentsInput);
  }
}
