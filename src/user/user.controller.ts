import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  UseGuards,
  Res,
  HttpStatus
} from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllUsers(@Res() res: Response) {
    try {
      const users = await this.userService.getAllUsers();
      res.status(HttpStatus.OK).send(users);
    } catch (e) {
      res.status(HttpStatus.BAD_REQUEST).send(e.message);
    }
  }

  @Patch('change-status')
  @UseGuards(JwtAuthGuard)
  async changeStatus(@Body('users') users: { id: string; isActive: boolean }[], @Res() res: Response) {
    try {
      const updatedUsers = await this.userService.changeStatus(users);
      res.status(HttpStatus.OK).send(`${updatedUsers} users are updated successfully.`);
    } catch (e) {
      res.status(HttpStatus.BAD_REQUEST).send(e.message);
    }
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Body('ids') ids: string[], @Res() res: Response) {
    try {
      const deletedUsers = await this.userService.deleteUser(ids);
      res.status(HttpStatus.OK).send(`${deletedUsers} users are deleted successfully.`);
    } catch (e) {
      res.status(HttpStatus.BAD_REQUEST).send(e.message);
    }
  }
}
