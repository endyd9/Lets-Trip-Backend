import { PickType } from '@nestjs/mapped-types';
import { WriteCommentInput } from './write-comment.dto';
import { CoreOutput } from 'src/common/dto/core.dto';

export class EditCommentInput extends PickType(WriteCommentInput, [
  'content',
  'password',
]) {}

export class EditCommentOutput extends CoreOutput {}
