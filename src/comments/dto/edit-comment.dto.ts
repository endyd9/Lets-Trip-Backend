import { WriteCommentInput } from './write-comment.dto';
import { CoreOutput } from 'src/common/dto/core.dto';

export class EditCommentInput extends WriteCommentInput {}

export class EditCommentOutput extends CoreOutput {}
