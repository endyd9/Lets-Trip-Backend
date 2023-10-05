import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { GetCommentsInput, GetCommentsOutput } from './dto/get-comments.dto';
import { WriteCommentInput, WriteCommentOutput } from './dto/write-comment.dto';
import { EditCommentInput, EditCommentOutput } from './dto/edit-comment.dto';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { User } from 'src/users/entities/user.entity';
import {
  DeleteCommentInput,
  DeleteCommentOutput,
} from './dto/delete-comment.dto';
import { WriteReplyInput } from './dto/write-reply.dto';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  //댓글
  @Get('post/:postId')
  getComments(
    @Param() { postId },
    @Query() getCommentsInput: GetCommentsInput,
  ): Promise<GetCommentsOutput> {
    return this.commentsService.getComments(postId, getCommentsInput);
  }

  @Post('post/:postId')
  writeCommet(
    @Param() { postId },
    @Body() writeCommentInput: WriteCommentInput,
    @AuthUser() user: User | undefined,
  ): Promise<WriteCommentOutput> {
    return this.commentsService.writeComment(postId, writeCommentInput, user);
  }

  @Patch('/:commentId')
  editComment(
    @Param() { commentId },
    @Body() editCommentInput: EditCommentInput,
    @AuthUser() user: User | undefined,
  ): Promise<EditCommentOutput> {
    return this.commentsService.editComment(commentId, editCommentInput, user);
  }

  @Delete('/:commentId')
  deleteComment(
    @Param() { commentId },
    @Body() deleteCommentInput: DeleteCommentInput,
    @AuthUser() user: User | undefined,
  ): Promise<DeleteCommentOutput> {
    return this.commentsService.deleteComment(
      commentId,
      deleteCommentInput,
      user,
    );
  }

  // 대댓글

  @Post('/:commentId')
  writeReply(
    @Param() { commentId }: { commentId: string },
    @AuthUser() user: User,
    @Body() writeReplyinput: WriteReplyInput,
  ) {
    return this.commentsService.writeReply(+commentId, writeReplyinput, user);
  }

  @Patch('/reply/:replyId')
  editReply(
    @Param() { replyId }: { replyId: string },
    @AuthUser() user: User,
    @Body() editReplyinput: EditCommentInput,
  ): Promise<EditCommentOutput> {
    return this.commentsService.editReply(+replyId, editReplyinput, user);
  }

  @Delete('/reply/:replyId')
  DeleteReply(
    @Param() { replyId }: { replyId: string },
    @AuthUser() user: User,
    @Body() deleteReplyinput: DeleteCommentInput,
  ): Promise<DeleteCommentOutput> {
    return this.commentsService.deleteReply(+replyId, deleteReplyinput, user);
  }
}
