import { IsOptional, IsString } from 'class-validator';
import { CoreOutput } from 'src/common/dto/core.dto';

export class DeleteCommentInput {
  @IsString()
  @IsOptional()
  readonly password: string;
}

export class DeleteCommentOutput extends CoreOutput {}
