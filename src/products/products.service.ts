// src/products/products.service.ts

import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { ElasticsearchService } from '../search/elasticsearch/elasticsearch.service'; // Assuming path to your service

// Simulate a Product entity/interface and a repository for context
interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
}

// Simulated repository for database operations
class ProductRepository {
    private currentId = 3;
    private products: Product[] = [
        { id: 1, name: 'Laptop Pro', price: 1200, stock: 10 },
        { id: 2, name: 'Mouse Gamer', price: 50, stock: 5 },
    ];

    async save(productData: Partial<Product>): Promise<Product> {
        const newProduct: Product = {
            id: this.currentId++,
            name: productData.name || 'New Product',
            price: productData.price || 0,
            stock: productData.stock || 0
        };
        this.products.push(newProduct);
        return newProduct;
    }
}


@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);
  private readonly productRepository = new ProductRepository(); // Simulated

  constructor(
    // Inject the Cache Manager instance (Redis)
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    // Inject the Elasticsearch service
    private readonly elasticsearchService: ElasticsearchService,
    // ... other injected services
  ) {}

  /**
   * Fetches the product catalog, using Redis cache if available.
   */
  async getProductCatalog(): Promise<Product[]> {
    // Define a unique cache key
    const cacheKey = 'product_catalog_all'; 

    // 1. Try to fetch data from Redis cache
    const cachedData = await this.cacheManager.get<Product[]>(cacheKey);

    if (cachedData) {
      this.logger.log('Serving product catalog from Redis Cache.');
      return cachedData;
    }

    // 2. If no cache hit, fetch from the database (simulated)
    this.logger.log('Cache miss. Fetching product catalog from PostgreSQL...');
    
    // NOTE: In a real app, this would be: 
    // const products = await this.productRepository.find({});
    const products: Product[] = this.productRepository['products']; 

    // 3. Store the result in Redis cache for 5 minutes (300 seconds TTL)
    await this.cacheManager.set(cacheKey, products, 300);

    return products;
  }

  /**
   * Creates a new product, saves it to the database, indexes it in Elasticsearch,
   * and clears the product catalog cache.
   * @param productData The data for the new product.
   */
  async createProduct(productData: Partial<Product>): Promise<Product> {
    this.logger.log(`Creating product: ${productData.name}`);

    // 1. Save product to PostgreSQL (simulated)
    const newProduct = await this.productRepository.save(productData);
    this.logger.log(`Product saved to DB with ID: ${newProduct.id}`);

    // 2. Index the product in Elasticsearch for search
    // NOTE: The 'indexProduct' method is assumed to exist on ElasticsearchService
    await this.elasticsearchService.indexProduct(newProduct);
    this.logger.log(`Product indexed in Elasticsearch.`);

    // 3. Clear cache if catalog changes
    await this.clearProductCache();

    return newProduct;
  }
  
  /**
   * Clears the main product catalog cache.
   */
  async clearProductCache() {
     const cacheKey = 'product_catalog_all';
     await this.cacheManager.del(cacheKey);
     this.logger.warn(`Product catalog cache (${cacheKey}) cleared.`);
  }
}