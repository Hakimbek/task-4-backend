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
  async changeStatus(@Body() body: { id: string; isActive: boolean }) {
    const { id, isActive } = body;
    return this.userService.changeStatus(id, isActive);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Body('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
