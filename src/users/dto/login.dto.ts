import { IsString } from 'class-validator';
import { CoreOutput } from 'src/common/dto/core.dto';

export class LoginInput {
  @IsString()
  readonly email: string;
  @IsString()
  readonly password: string;
}

export class LoginOutput extends CoreOutput {
  readonly token?: string;
}
