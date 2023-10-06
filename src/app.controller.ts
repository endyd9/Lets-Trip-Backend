import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserInput, CreateUserOutput } from './users/dto/create-user.dto';
import { LoginInput, LoginOutput } from './users/dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { SearchInput } from './users/dto/search.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private jwtService: JwtService,
  ) {}

  @Get()
  home() {
    return this.appService.getHomeData();
  }

  @Post('join')
  createUser(
    @Body() createUserInput: CreateUserInput,
  ): Promise<CreateUserOutput> {
    return this.appService.join(createUserInput);
  }

  @Post('login')
  login(@Body() loginInput: LoginInput): Promise<LoginOutput> {
    return this.appService.login(loginInput);
  }

  @Get('search')
  search(@Query() query: SearchInput) {
    return this.appService.searchPosts(query);
  }
}
