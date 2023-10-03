import { IsString } from 'class-validator';
import { CoreOutput } from 'src/common/dto/core.dto';
import { Comment } from '../entities/comment.entity';

export class GetCommentsInput {
  @IsString()
  readonly page: string;
}

export class GetCommentsOutput extends CoreOutput {
  comments?: Comment[];
}
