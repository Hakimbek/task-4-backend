import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, } from 'typeorm';
import { IsEmail, IsBoolean, IsNotEmpty } from 'class-validator';
import * as bcrypt from 'bcrypt';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsNotEmpty({ message: 'Username is required' })
  username: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @IsNotEmpty()
  password: string;

  @Column()
  @IsBoolean()
  isActive: boolean;

  @Column()
  lastLoginTime: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
