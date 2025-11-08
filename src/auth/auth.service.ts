// src/auth/auth.service.ts

import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, pass: string): Promise<{ user: any }> {
    // 1. Check if user already exists
    const existingUser = await this.userService.findOneByEmail(email);
    
    if (existingUser) {
      // Throw a ConflictException if the email is already in use
      throw new ConflictException('User with this email already exists');
    }
    
    // 2. If user does not exist, proceed with creation
    const user = await this.userService.create(email, pass);
    
    // Exclude the sensitive hash from the response
    const { password_hash, ...result } = user; 
    return { user: result };
  }

  async login(email: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.userService.findOneByEmail(email);

    if (!user || !(await bcrypt.compare(pass, user.password_hash))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate token payload
    const payload = { email: user.email, sub: user.id, role: user.role };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}