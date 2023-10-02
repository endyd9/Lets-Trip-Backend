import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserInput, CreateUserOutput } from './users/dto/create-user.dto';
import { LoginInput, LoginOutput } from './users/dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth/auth.guard';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private jwtService: JwtService,
  ) {}
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