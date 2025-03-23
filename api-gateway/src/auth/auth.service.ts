import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { validatePassword } from '../lib/crypto';
import { RegisterDto } from './dto/registration-request.dto';
import config from '../config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(data: RegisterDto) {
    await this.usersService.create(data);
  }

  async signIn(username: string, pass: string) {
    const user = await this.usersService.findOne(username);
    let isValidPass = false;

    try {
      isValidPass = await validatePassword(pass, user.password);
    } catch (error) {
      console.error(`verification failed - ${error}`);
      throw new UnauthorizedException();
    }

    if (!isValidPass) {
      throw new UnauthorizedException();
    }

    const payload = { username: user.username, sub: user.id };

    let accessToken = (await this.usersService.getUserAuthToken(username))[0]
      ?.token;

    if (!accessToken) {
      accessToken = await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: config.JWT_SECRET,
      });
      await this.usersService.saveAccessToken(username, accessToken);
    }

    return {
      accessToken,
    };
  }
}
