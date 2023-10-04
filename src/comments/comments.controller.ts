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

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

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
}
