import { Controller, Get, Patch, Delete, Body, UseGuards, Res, HttpStatus} from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllUsers(@Res() res: Response) {
    const users = await this.userService.getAllUsers();
    res.status(HttpStatus.OK).send({ message: 'Success', statusCode: HttpStatus.OK, users });
  }

  @Patch('disable')
  @UseGuards(JwtAuthGuard)
  async disable(@Body('ids') ids: string[], @Res() res: Response) {
    const users = await this.userService.changeStatus(ids, false);
    res.status(HttpStatus.OK).send({ message: 'Disabled', statusCode: HttpStatus.OK, users });
  }

  @Patch('activate')
  @UseGuards(JwtAuthGuard)
  async activate(@Body('ids') ids: string[], @Res() res: Response) {
    const users = await this.userService.changeStatus(ids, true);
    res.status(HttpStatus.OK).send({ message: 'Disabled', statusCode: HttpStatus.OK, users });
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Body('ids') ids: string[], @Res() res: Response) {
    const users = await this.userService.deleteUser(ids);
    res.status(HttpStatus.OK).send({ message: 'Deleted', statusCode: HttpStatus.OK, users });
  }
}
