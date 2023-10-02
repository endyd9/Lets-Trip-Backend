import { IsArray, IsObject, IsOptional, IsString } from 'class-validator';
import { CoreOutput } from 'src/common/dto/core.dto';
import { User } from 'src/users/entities/user.entity';

export class PostInput {
  @IsString()
  readonly title: string;

  @IsString()
  readonly content: string;

  @IsString()
  @IsOptional()
  readonly imgUrl: string;

  @IsObject()
  @IsOptional()
  readonly writer?: User;

  @IsString()
  @IsOptional()
  readonly nomem?: string;

  @IsString()
  @IsOptional()
  readonly password?: string;
}

export class PostOutput extends CoreOutput {
  postId?: number;
}
