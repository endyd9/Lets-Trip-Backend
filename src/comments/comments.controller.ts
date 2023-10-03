import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { GetCommentsInput, GetCommentsOutput } from './dto/get-comments.dto';
import { WriteCommentInput, WriteCommentOutput } from './dto/write-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Get('/:postId')
  getComments(
    @Param() { postId },
    @Query() getCommentsInput: GetCommentsInput,
  ): Promise<GetCommentsOutput> {
    return this.commentsService.getComments(postId, getCommentsInput);
  }

  @Post('/:postId')
  writeCommet(
    @Param() { postId },
    @Body() writeCommentInput: WriteCommentInput,
  ): Promise<WriteCommentOutput> {
    return this.commentsService.writeComment(postId, writeCommentInput);
  }
}
