// src/auth/auth.controller.ts

import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';

// Simple DTOs for demonstration - you should create separate files for these
class RegisterDto {
  email: string;
  password: string; // RENAMED FROM 'pass'
}

class LoginDto {
  email: string;
  password: string; // RENAMED FROM 'pass'
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    // UPDATED to reference 'registerDto.password'
    return this.authService.register(registerDto.email, registerDto.password);
  }

  @HttpCode(200) // Ensure a 200 status code for login success
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    // UPDATED to reference 'loginDto.password'
    return this.authService.login(loginDto.email, loginDto.password);
  }
}