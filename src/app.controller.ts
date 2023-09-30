import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserInput, CreateUserOutput } from './users/dto/create-user.dto';
import { LoginInput, LoginOutput } from './users/dto/login.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('join')
  createUser(
    @Body() createUserInput: CreateUserInput,
  ): Promise<CreateUserOutput> {
    return this.appService.join(createUserInput);
  }

  @Post('login')
  @HttpCode(200)
  login(@Body() loginInput: LoginInput): Promise<LoginOutput> {
    return this.appService.login(loginInput);
  }
}
