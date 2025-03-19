import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  UseGuards,
} from '@nestjs/common';
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
  async changeStatus(@Body('users') users: { id: string; isActive: boolean }[]) {
    return this.userService.changeStatus(users);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Body('ids') ids: string[]) {
    return this.userService.deleteUser(ids);
  }
}
