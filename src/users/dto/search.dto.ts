import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CoreOutput } from 'src/common/dto/core.dto';
import { Post } from 'src/posts/entities/post.entity';

export type SearchTypes = 'title' | 'content' | 'writer';

export const SearchTypes: SearchTypes[] = ['title', 'content', 'writer'];

export class SearchInput {
  @IsEnum(SearchTypes)
  type: SearchTypes;

  @IsString()
  keyword: string;

  @IsString()
  @IsOptional()
  page?: string;
}

export class SearchOutput extends CoreOutput {
  post: Post[];
}
