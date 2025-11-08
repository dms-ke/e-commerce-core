// src/user/user.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service'; // Import the service

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService], // Provide the service
  exports: [UserService], // Export the service for other modules (like Auth)
})
export class UserModule {}