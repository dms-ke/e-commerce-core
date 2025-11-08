// src/user/user.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * Finds a user by email.
   * Note: The findOne method in newer TypeORM returns Promise<Entity | null> if no entity is found.
   * @param email The email of the user to find.
   * @returns A Promise that resolves to the User entity or null.
   */
  async findOneByEmail(email: string): Promise<User | null> { 
    return this.userRepository.findOne({ where: { email } });
  }

  /**
   * Creates a new user with a hashed password.
   * @param email The user's email.
   * @param pass The user's plain text password.
   * @returns A Promise that resolves to the newly created User entity.
   */
  async create(email: string, pass: string): Promise<User> {
    // Hashing the password before saving
    const password_hash = await bcrypt.hash(pass, 10);

    const newUser = this.userRepository.create({ email, password_hash });
    await this.userRepository.save(newUser);
    return newUser;
  }
}