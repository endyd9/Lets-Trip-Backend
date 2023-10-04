import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsOutput, PostsInput } from './dto/posts.dto';
import { PostInput, PostOutput } from './dto/post.dto';
import { EditPostInput, EditPostOutput } from './dto/edit-post.dto';
import { DeletePostInput, DeletePostOutput } from './dto/delete-post.dto';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Get()
  posts(@Query() query: PostsInput): Promise<PostsOutput> {
    return this.postService.getPosts(query);
  }

  @Post()
  uploadPost(
    @Body() postInput: PostInput,
    @AuthUser() user: User | undefined,
  ): Promise<PostOutput> {
    return this.postService.uploadPost(postInput, user);
  }

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
}
