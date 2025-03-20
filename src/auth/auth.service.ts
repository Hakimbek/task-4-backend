import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async validateToken(token: string) {
    try {
      this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException("Invalid or expired token");
    }
  }

  async login(email: string, password: string) {
    const user: User = await this.validateUser(email, password);

    if (!user) throw new UnauthorizedException('Invalid email or password');
    if (!user.isActive) throw new UnauthorizedException('User is disabled');

    user.lastLoginTime = new Date();
    await this.userService.updateLastLoginTime(user.id);
    const payload = { sub: user.id, email: user.email };

    return this.jwtService.sign(payload);
  }

  async signup(email: string, username: string, password: string) {
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) throw new ConflictException('Email already in use');
    await this.userService.createUser(email, username, password);
  }
}
