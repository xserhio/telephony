import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { PublicDecorator } from './decorators/public.decorator';
import { SignInDto } from './dto/sign-in-request.dto';
import { RegisterDto } from './dto/registration-request.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @PublicDecorator()
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  signIn(@Body() { username, password }: SignInDto) {
    return this.authService.signIn(username, password);
  }

  @PublicDecorator()
  @HttpCode(HttpStatus.OK)
  @Post('/register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @UseGuards(AuthGuard)
  @Get('/whoiam')
  async whoiam(@Req() request: Request) {
    return { user: { username: request['user']?.username } };
  }
}
