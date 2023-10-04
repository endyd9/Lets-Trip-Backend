import { IsString } from 'class-validator';
import { CoreOutput } from 'src/common/dto/core.dto';

export class ChangePasswordInput {
  @IsString()
  oldPassword: string;

  @IsString()
  newPassword: string;
}

export class ChangePasswordOutput extends CoreOutput {}
