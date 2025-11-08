// src/orders/orders.controller.ts

import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'; 
// If you have a service, you would import it here:
// import { OrdersService } from './orders.service'; 

@Controller('orders') // This defines the base route: /orders
export class OrdersController {
  
  // If you had an OrdersService, you would inject it here:
  // constructor(private ordersService: OrdersService) {}

  /**
   * Protected route to retrieve a list of orders for the authenticated user.
   * Maps to: GET /orders
   */
  @UseGuards(AuthGuard('jwt')) // Protects this route using the JWT strategy
  @Get() 
  async findAll(@Req() req) {
    // The decoded user payload is available in req.user
    
    // For now, return a placeholder to confirm the route and authentication guard are working:
    return {
      message: `Successfully accessed protected /orders route. User ID: ${req.user.sub}`,
      orders: []
    };
  }
}