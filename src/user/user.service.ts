import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository, In } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async createUser(
    email: string,
    username: string,
    password: string,
  ): Promise<User> {
    const user = this.userRepository.create({
      email,
      username,
      password,
      isActive: true,
      lastLoginTime: new Date(),
    });
    return this.userRepository.save(user);
  }

  async changeStatus(users: { id: string; isActive: boolean; }[]): Promise<number> {
    const ids = users.map(user => user.id);
    const existingUsers = await this.userRepository.findBy({ id: In(ids) });
    const existingIds = existingUsers.map(user => user.id);
    const invalidIds = ids.filter(id => !existingIds.includes(id));

    if (invalidIds.length > 0) throw new NotFoundException(`User with IDs ${invalidIds.join(', ')} not found`);

    const updatePromises = users.map(user =>
        this.userRepository.update(user.id, { isActive: user.isActive }),
    );

    await Promise.all(updatePromises);

    return users.length;
  }

  async updateLastLoginTime(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    user.lastLoginTime = new Date();

    return this.userRepository.save(user);
  }

  async deleteUser(ids: string[]): Promise<number> {
    const existingUsers = await this.userRepository.findBy({ id: In(ids) });
    const existingIds = existingUsers.map(user => user.id);
    const invalidIds = ids.filter(id => !existingIds.includes(id));

    if (invalidIds.length > 0) throw new BadRequestException(`Invalid or non-existent IDs: ${invalidIds.join(', ')}`);

    const deleteResult = await this.userRepository.delete(existingIds);

    return deleteResult.affected || 0;
  }
}
