import { PickType } from '@nestjs/mapped-types';
import { User } from '../entities/user.entity';
import { IsString } from 'class-validator';
import { CoreOutput } from 'src/common/dto/core.dto';

export class EditUserInput extends PickType(User, [
  'password',
  'nickName',
  'avatarUrl',
]) {
  @IsString()
  readonly password: string;

  @IsString()
  readonly nickName: string;

  @IsString()
  readonly avatarUrl: string;
}

export class EditUserOutput extends CoreOutput {}
