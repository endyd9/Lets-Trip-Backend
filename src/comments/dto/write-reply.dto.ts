import { CoreOutput } from 'src/common/dto/core.dto';
import { WriteCommentInput } from './write-comment.dto';

export class WriteReplyInput extends WriteCommentInput {}

export class WriteReplyOutput extends CoreOutput {}
