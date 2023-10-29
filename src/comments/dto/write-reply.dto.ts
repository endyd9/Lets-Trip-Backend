import { CoreOutput } from 'src/common/dto/core.dto';
import { WriteCommentInput } from './write-comment.dto';
import { Reply } from '../entities/reply.entity';

export class WriteReplyInput extends WriteCommentInput {}

export class WriteReplyOutput extends CoreOutput {
  reply?: Reply;
}
