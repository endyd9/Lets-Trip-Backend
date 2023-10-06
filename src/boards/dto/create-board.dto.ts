import { IsString } from 'class-validator';
import { CoreOutput } from 'src/common/dto/core.dto';
import { Board } from '../entities/border.entity';

export class CreateBoardInput {
  @IsString()
  name: string;
}

export class CreateBoardOutput extends CoreOutput {}
