import { Injectable, NotFoundException, BadRequestException, MethodNotAllowedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository, In } from 'typeorm';
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async getAllUsers(authHeader: string): Promise<User[]> {
    await this.checkUserToken(authHeader.split(" ")[1]);
    return this.userRepository.find();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async createUser(email: string, username: string, password: string): Promise<void> {
    const user = this.userRepository.create({
      email,
      username,
      password,
      isActive: true,
      lastLoginTime: new Date()
    });
    await this.userRepository.save(user);
  }

  async changeStatus(ids: string[], isActive: boolean, authHeader: string): Promise<User[]> {
    await this.checkUserToken(authHeader.split(" ")[1]);
    const existingUsers = await this.userRepository.findBy({ id: In(ids) });
    const existingIds = existingUsers.map(user => user.id);
    const invalidIds = ids.filter(id => !existingIds.includes(id));

    if (invalidIds.length > 0) throw new NotFoundException(`User with IDs ${invalidIds.join(', ')} not found`);

    const updatePromises = ids.map(id => this.userRepository.update(id, { isActive }));
    await Promise.all(updatePromises);

    return this.userRepository.find();
  }

  async updateLastLoginTime(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    user.lastLoginTime = new Date();
    await this.userRepository.save(user);
  }

  async deleteUser(ids: string[], authHeader: string): Promise<User[]> {
    await this.checkUserToken(authHeader.split(" ")[1]);
    const existingUsers = await this.userRepository.findBy({ id: In(ids) });
    const existingIds = existingUsers.map(user => user.id);
    const invalidIds = ids.filter(id => !existingIds.includes(id));

    if (invalidIds.length > 0) throw new BadRequestException(`Invalid or non-existent IDs: ${invalidIds.join(', ')}`);

    await this.userRepository.delete(existingIds);

    return this.userRepository.find();
  }

  async checkUserToken(token: string): Promise<void> {
    const { sub } = this.jwtService.decode(token);
    const user = await this.userRepository.findOne({ where: { id: sub } });
    if (!user) throw new MethodNotAllowedException(`User not found`);
    if (!user.isActive) throw new MethodNotAllowedException(`User is disabled`);
  }
}
