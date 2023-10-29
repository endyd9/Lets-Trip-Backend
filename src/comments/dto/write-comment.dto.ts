import { IsOptional, IsString } from 'class-validator';
import { CoreOutput } from 'src/common/dto/core.dto';
import { Comment } from '../entities/comment.entity';

export class WriteCommentInput {
  @IsString()
  @IsOptional()
  readonly nomem?: string;

  @IsString()
  @IsOptional()
  readonly password?: string;

  @IsString()
  readonly content: string;
}

export class WriteCommentOutput extends CoreOutput {
  newComment?: Comment;
}
