import { IsOptional, IsString } from 'class-validator';
import { CoreOutput } from 'src/common/dto/core.dto';
import { User } from 'src/users/entities/user.entity';

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

export class WriteCommentOutput extends CoreOutput {}
