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
  ): Promise<WriteCommentOutput> {
    return this.commentsService.writeComment(postId, writeCommentInput);
  }

  @Patch('/:commentId')
  editComment(
    @Param() { commentId },
    @Body() editCommentInput: EditCommentInput,
  ): Promise<EditCommentOutput> {
    return this.commentsService.editComment(commentId, editCommentInput);
  }

  @Delete('/:commentId')
  deleteComment(@Param() { commentId }) {}
}
