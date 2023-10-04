import { PickType } from '@nestjs/mapped-types';
import { User } from '../entities/user.entity';
import { IsOptional, IsString } from 'class-validator';
import { CoreOutput } from 'src/common/dto/core.dto';

export class EditUserInput extends PickType(User, ['nickName', 'avatarUrl']) {
  @IsString()
  @IsOptional()
  readonly nickName: string;

  @IsString()
  @IsOptional()
  readonly avatarUrl: string;
}

export class EditUserOutput extends CoreOutput {}
