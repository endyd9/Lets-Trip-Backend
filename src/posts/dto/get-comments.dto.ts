import { IsOptional, IsString } from 'class-validator';
import { Comment } from 'src/comments/entities/comment.entity';
import { CoreOutput } from 'src/common/dto/core.dto';

export class GetCommentsInput {
  @IsString()
  @IsOptional()
  readonly page?: string;
}

export class GetCommentsOutput extends CoreOutput {
  comments?: Comment[];
}
