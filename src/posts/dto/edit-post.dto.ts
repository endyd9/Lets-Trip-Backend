import { IsOptional, IsString } from 'class-validator';
import { CoreOutput } from 'src/common/dto/core.dto';

export class EditPostInput {
  @IsString()
  @IsOptional()
  readonly title?: string;

  @IsString()
  @IsOptional()
  readonly content?: string;

  @IsString()
  @IsOptional()
  readonly imgUrl?: string;

  @IsString()
  @IsOptional()
  readonly password?: string;
}

export class EditPostOutput extends CoreOutput {}
