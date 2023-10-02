import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsOutput, PostsInput } from './dto/posts.dto';
import { PostInput, PostOutput } from './dto/post.dto';

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
}
