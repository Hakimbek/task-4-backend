import {Controller, Post, Body, Res, HttpStatus} from '@nestjs/common';
import { AuthService } from './auth.service';
import {Response} from "express";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }, @Res() res: Response) {
    try {
      const { email, password } = body;
      const token = await this.authService.login(email, password);
      res.status(HttpStatus.OK).json(token);
    } catch (e) {
      res.status(HttpStatus.BAD_REQUEST).send(e.message);
    }
  }

  @Post('signup')
  async signup(
    @Body() body: { email: string; username: string; password: string },
    @Res() res: Response
  ) {
    try {
      const { email, username, password } = body;
      await this.authService.signup(email, username, password);
      res.status(HttpStatus.CREATED).send('User successfully created. Please login.');
    } catch (e) {
      res.status(HttpStatus.CONFLICT).send(e.message);
    }
  }
}
