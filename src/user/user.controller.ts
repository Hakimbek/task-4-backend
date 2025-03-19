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
import { User } from './user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @Patch('change-status')
  @UseGuards(JwtAuthGuard)
  async changeStatus(@Body('users') users: { id: string; isActive: boolean }[], @Res() res: Response) {
    try {
      const updatedUsers = this.userService.changeStatus(users);
      res.status(HttpStatus.OK).send(`${updatedUsers} users are updated successfully.`);
    } catch (e) {
      res.status(HttpStatus.BAD_REQUEST).send(e.message);
    }
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Body('ids') ids: string[], @Res() res: Response) {
    try {
      const deletedUsers = this.userService.deleteUser(ids);
      res.status(HttpStatus.OK).send(`${deletedUsers} users are deleted successfully.`);
    } catch (e) {
      res.status(HttpStatus.BAD_REQUEST).send(e.message);
    }
  }
}
