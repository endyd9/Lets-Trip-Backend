import { PickType } from '@nestjs/mapped-types';
import { User } from '../entities/user.entity';
import { IsOptional, IsString } from 'class-validator';
import { CoreOutput } from 'src/common/dto/core.dto';

export class CreateUserInput extends PickType(User, [
  'email',
  'password',
  'nickName',
  'avatarUrl',
]) {
  @IsString()
  readonly email: string;

  @IsString()
  readonly password: string;

  @IsString()
  readonly nickName: string;

  @IsString()
  @IsOptional()
  readonly avatarUrl: string;
}

export class CreateUserOutput extends CoreOutput {}
