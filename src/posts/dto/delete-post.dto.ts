import { IsOptional, IsString } from 'class-validator';
import { CoreOutput } from 'src/common/dto/core.dto';

export class DeletePostInput {
  @IsString()
  @IsOptional()
  readonly password?: string;
}

export class DeletePostOutput extends CoreOutput {}
