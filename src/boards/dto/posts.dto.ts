import { IsOptional, IsString } from 'class-validator';
import { CoreOutput } from 'src/common/dto/core.dto';
import { Post } from 'src/posts/entities/post.entity';

export class PostsInput {
  @IsString()
  @IsOptional()
  readonly limit?: number;

  @IsString()
  @IsOptional()
  readonly sort?: string;

  @IsString()
  @IsOptional()
  readonly page?: number;
}

export class PostsOutput extends CoreOutput {
  posts?: Post[];
}
