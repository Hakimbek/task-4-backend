import { Controller, Post, Body, Res, Get, Headers, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from "express";
import SignUpDto from "../dto/SignUpDto";
import LogInDto from "../dto/LogInDto";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() { email, password }: LogInDto, @Res() res: Response) {
    const token = await this.authService.login(email, password);
    res.status(HttpStatus.OK).json({ message: 'Successfully logged in', statusCode: HttpStatus.OK, token });
  }

  @Post('signup')
  async signup(@Body() { email, username, password }: SignUpDto, @Res() res: Response) {
    await this.authService.signup(email, username, password);
    res.status(HttpStatus.OK).json({ message: 'User successfully created. Please login', statusCode: HttpStatus.OK });
  }

  @Get("validate")
  async validateToken(@Headers("authorization") authHeader: string, @Res() res: Response) {
    if (!authHeader || !authHeader.startsWith("Bearer ")) throw new UnauthorizedException("Invalid or expired token");
    await this.authService.validateToken(authHeader.split(" ")[1]);
    res.status(HttpStatus.OK).json({ message: 'Token is valid', statusCode: HttpStatus.OK });
  }
}
