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

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Get()
  posts(@Query() query: PostsInput): Promise<PostsOutput> {
    return this.postService.getPosts(query);
  }

  @Post()
  uploadPost(@Body() postInput: PostInput): Promise<PostOutput> {
    return this.postService.uploadPost(postInput);
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
  ): Promise<EditPostOutput> {
    return this.postService.editPost(id, editPostInput);
  }

  @Delete(':id')
  deletePost(
    @Param() { id },
    @Body() deletePostInput: DeletePostInput,
  ): Promise<DeletePostOutput> {
    return this.postService.deletePost(id, deletePostInput);
  }
}
