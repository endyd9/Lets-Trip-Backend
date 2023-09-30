import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { EditUserInput, EditUserOutput } from './dto/edit-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':uid')
  findOne(@Param('uid') uid: string) {
    return this.usersService.findOne(+uid);
  }

  @Patch(':uid')
  update(
    @Param('uid') uid: string,
    @Body() EditUserDto: EditUserInput,
  ): Promise<EditUserOutput> {
    return this.usersService.update(+uid, EditUserDto);
  }

  @Delete(':uid')
  remove(@Param('uid') uid: string) {
    return this.usersService.remove(+uid);
  }
}
