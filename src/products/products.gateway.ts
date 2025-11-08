// src/products/products.gateway.ts

import { 
  WebSocketGateway, 
  SubscribeMessage, 
  MessageBody, 
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*', // IMPORTANT: Set a specific frontend URL in production
  },
  // You can set a namespace or path if needed, e.g., 'updates'
})
export class ProductsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(ProductsGateway.name);

  // Injects the WebSocket server instance
  @WebSocketServer() 
  server: Server; 

  // --- Connection & Disconnection Handlers ---

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    // Optional: Send a welcome message upon connection
    client.emit('status', { message: 'Connected to E-commerce Updates' });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // --- Example 1: Frontend Subscribes to Product Updates ---

  @SubscribeMessage('subscribeToProduct')
  handleSubscribe(client: Socket, @MessageBody() data: { productId: number }) {
    // Client joins a "room" dedicated to the specific product ID
    client.join(`product:${data.productId}`); 
    this.logger.log(`Client ${client.id} subscribed to Product ID: ${data.productId}`);
    // Confirmation message back to the client
    client.emit('product_subscription_status', { subscribed: true, productId: data.productId });
  }

  // --- Example 2: Backend pushes a Real-Time Stock Update ---

  // This method is called internally by a NestJS service (e.g., when an order is placed)
  public notifyProductStockUpdate(productId: number, newStock: number) {
    const payload = { 
      productId, 
      newStock, 
      timestamp: new Date().toISOString() 
    };

    // Emits the update only to clients subscribed to this product's room
    this.server.to(`product:${productId}`).emit('stock_update', payload); 
    this.logger.log(`Pushed stock update for Product ${productId}: ${newStock}`);
  }
}