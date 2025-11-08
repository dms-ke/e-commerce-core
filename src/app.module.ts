// src/app.module.ts

import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager'; // Import CacheModule
import * as redisStore from 'cache-manager-redis-store'; // Import Redis Store adapter
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices'; // Added Microservice client imports

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { SearchModule } from './search/search.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    // 1. Database Configuration
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', // or your PostgreSQL host
      port: 5432,
      username: 'postgres', // e.g., 'postgres'
      password: 'Mutiso488@@@', // Replace with your password
      database: 'ecommerce_db', // The name of your database
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // Auto-load entities
      synchronize: true, // WARNING: Set to 'false' in production; good for dev
    }),

    // 2. Define the Redis Client for the AI Service (Microservice Communication)
    ClientsModule.register([
      {
        name: 'AI_SERVICE_REDIS', // Unique token to inject the client
        transport: Transport.REDIS,
        options: {
          host: 'localhost', // Or your Redis host
          port: 6379,
        },
      },
    ]),

    // 3. Configure the Caching Layer using Redis (Internal Caching)
    CacheModule.register({
      isGlobal: true, // Makes the cache instance available everywhere
      store: redisStore,
      host: 'localhost', // Your Redis host (same as microservice, usually)
      port: 6379, // Your Redis port
      ttl: 60, // Default TTL (Time To Live) for cache entries in seconds
    }),

    // 4. Feature Modules
    UserModule,
    AuthModule,
    ProductsModule,
    SearchModule,
    OrdersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}