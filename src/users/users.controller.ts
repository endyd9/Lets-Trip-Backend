import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { EditUserDto } from './dto/edit-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':uid')
  findOne(@Param('uid') uid: string) {
    return this.usersService.findOne(+uid);
  }

  @Patch(':uid')
  update(@Param('uid') uid: string, @Body() EditUserDto: EditUserDto) {
    return this.usersService.update(+uid, EditUserDto);
  }

  @Delete(':uid')
  remove(@Param('uid') uid: string) {
    return this.usersService.remove(+uid);
  }
}
