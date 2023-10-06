import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateBoardInput, CreateBoardOutput } from './dto/create-board.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { EditBoardInput, EditBoardOutput } from './dto/edit-board.dto';

@Controller('boards')
export class BoardsController {
  constructor(private boardsService: BoardsService) {}

  @Get()
  allBoard() {
    return this.boardsService.getAll();
  }

  @UseGuards(AuthGuard)
  @Post()
  createBoard(
    @Body() createBoardInput: CreateBoardInput,
    @AuthUser() user: User,
  ): Promise<CreateBoardOutput> {
    return this.boardsService.create(createBoardInput, user);
  }

  @UseGuards(AuthGuard)
  @Patch('/:boardId')
  editBoard(
    @Param() { boardId }: { boardId: string },
    @Body() editBoardInput: EditBoardInput,
    @AuthUser() user: User,
  ): Promise<EditBoardOutput> {
    return this.boardsService.edit(+boardId, editBoardInput, user);
  }

  @UseGuards(AuthGuard)
  @Delete('/:boardId')
  deleteBoard(
    @Param() { boardId }: { boardId: string },
    @AuthUser() user: User,
  ) {
    return this.boardsService.delete(+boardId, user);
  }

  @Post('/:boardId/confirm')
  confirm(@Param() { boardId }: { boardId: string }, @AuthUser() user: User) {
    return this.boardsService.confirm(+boardId, user);
  }
}
