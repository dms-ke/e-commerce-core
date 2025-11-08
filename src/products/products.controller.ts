import { Controller, Get } from '@nestjs/common';

@Controller('products')
export class ProductsController {
  // You can inject the service here later:
  // constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(): string {
    return 'This returns all products';
  }
}