import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { EditUserInput, EditUserOutput } from './dto/edit-user.dto';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { User } from './entities/user.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  ChangePasswordInput,
  ChangePasswordOutput,
} from './dto/change-password.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @AuthUser() user: User,
    @Body() EditUserDto: EditUserInput,
  ): Promise<EditUserOutput> {
    if (user.id !== +id) {
      throw new HttpException('권한없음', HttpStatus.FORBIDDEN);
    }
    return this.usersService.update(+id, EditUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@AuthUser() user: User, @Param('id') id: string) {
    if (user.id !== +id) {
      throw new HttpException('권한없음', HttpStatus.FORBIDDEN);
    }
    return this.usersService.remove(+id);
  }

  @Patch(':id/password')
  @UseGuards(AuthGuard)
  passwordChange(
    @AuthUser() user: User,
    @Param('id') id: string,
    @Body() { oldPassword, newPassword }: ChangePasswordInput,
  ): Promise<ChangePasswordOutput> {
    if (user.id !== +id) {
      throw new HttpException('권한없음', HttpStatus.FORBIDDEN);
    }
    return this.usersService.changePassword(+id, oldPassword, newPassword);
  }

  @Get('/:userId/posts')
  getUsersWritePosts(@Param('') { userId }: { userId: string }) {
    return this.usersService.getUsersWritePosts(+userId);
  }

  @Get('/:userId/likes')
  getUsersLikedPosts(@Param('') { userId }: { userId: string }) {
    return this.usersService.getUsersLikedPosts(+userId);
  }
}
