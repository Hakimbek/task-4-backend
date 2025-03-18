import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    return this.authService.login(email, password);
  }

  @Post('signup')
  async signup(
    @Body() body: { email: string; username: string; password: string },
  ) {
    const { email, username, password } = body;
    return this.authService.signup(email, username, password);
  }
}
