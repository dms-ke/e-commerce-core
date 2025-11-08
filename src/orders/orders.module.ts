// src/orders/orders.module.ts

import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport'; // <--- Ensure this is imported
import { AuthModule } from '../auth/auth.module'; // <--- TRY IMPORTING THE FULL AUTH MODULE
import { OrdersController } from './orders.controller'; 

@Module({
  imports: [
    PassportModule, // Provides general Passport functionality
    AuthModule,     // <--- ADD THIS TO ENSURE ALL JWT/PASSPORT CONFIG IS AVAILABLE
  ], 
  controllers: [OrdersController], 
  providers: [
    // OrdersService, 
  ], 
  exports: []
})
export class OrdersModule {}