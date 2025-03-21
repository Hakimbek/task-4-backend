import {Controller, Get, Patch, Delete, Body, UseGuards, Res, HttpStatus, Headers} from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllUsers(@Res() res: Response, @Headers("authorization") authHeader: string) {
    const users = await this.userService.getAllUsers(authHeader);
    res.status(HttpStatus.OK).send({ message: 'Success', statusCode: HttpStatus.OK, users });
  }

  @Patch('disable')
  @UseGuards(JwtAuthGuard)
  async disable(@Body('ids') ids: string[], @Res() res: Response, @Headers("authorization") authHeader: string) {
    const users = await this.userService.changeStatus(ids, false, authHeader);
    res.status(HttpStatus.OK).send({ message: 'Disabled', statusCode: HttpStatus.OK, users });
  }

  @Patch('activate')
  @UseGuards(JwtAuthGuard)
  async activate(@Body('ids') ids: string[], @Res() res: Response, @Headers("authorization") authHeader: string) {
    const users = await this.userService.changeStatus(ids, true, authHeader);
    res.status(HttpStatus.OK).send({ message: 'Activated', statusCode: HttpStatus.OK, users });
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Body('ids') ids: string[], @Res() res: Response, @Headers("authorization") authHeader: string) {
    const users = await this.userService.deleteUser(ids, authHeader);
    res.status(HttpStatus.OK).send({ message: 'Deleted', statusCode: HttpStatus.OK, users });
  }
}
