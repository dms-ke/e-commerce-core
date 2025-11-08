// src/products/products.module.ts

import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager'; // <-- CORRECTED IMPORT PATH
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductsGateway } from './products.gateway';
import { SearchModule } from '../search/search.module';

@Module({
  imports: [
    SearchModule, // Provides ElasticsearchService
    CacheModule.register({ 
      // Use your actual cache configuration here
      ttl: 60, // seconds
      max: 10, // maximum number of items in cache
    }), 
  ], 
  controllers: [ProductsController],
  providers: [ProductsService, ProductsGateway],
  exports: [ProductsService, ProductsGateway]
})
export class ProductsModule {}