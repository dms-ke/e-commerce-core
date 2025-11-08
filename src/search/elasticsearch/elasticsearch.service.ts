// src/search/elasticsearch/elasticsearch.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { Client as ESClient } from '@elastic/elasticsearch';

// NOTE: Removed the failing import:
// import type { SearchResponse } from '@elastic/elasticsearch/api/types';

// Define the index name for your products
const PRODUCTS_INDEX = 'products'; 

@Injectable()
export class ElasticsearchService {
  private esClient: ESClient;
  private readonly logger = new Logger(ElasticsearchService.name);

  constructor() {
    // Initialize the client, connecting to the default host/port
    this.esClient = new ESClient({
      node: 'http://localhost:9200', // Ensure this matches your running ES instance
    });
    this.createIndexIfNotExists();
  }

  private async createIndexIfNotExists() {
    try {
      // Correct for v8+ client: indices.exists() returns a boolean
      const exists = await this.esClient.indices.exists({ index: PRODUCTS_INDEX });
      
      if (!exists) { 
        await this.esClient.indices.create({ index: PRODUCTS_INDEX });
        this.logger.log(`Created Elasticsearch index: ${PRODUCTS_INDEX}`);
      } else {
        this.logger.log(`Elasticsearch index ${PRODUCTS_INDEX} already exists.`);
      }
    } catch (error) {
      this.logger.error('Failed to connect to Elasticsearch or create index.', error.message);
    }
  }

  // 1. Indexing Method (To add/update a single document)
  async indexProduct(product: any) {
    return this.esClient.index({
      index: PRODUCTS_INDEX,
      id: product.id.toString(),
      document: product,
    });
  }

  // 2. Search Method (The core function for searching)
  async search(query: string, page: number = 1, size: number = 10) {
    const skip = (page - 1) * size;

    // Correct for v8+ client: query object is now a top-level property
    const response = await this.esClient.search({
      index: PRODUCTS_INDEX,
      from: skip,
      size: size,
      query: { 
        multi_match: {
          query: query,
          fields: ['name^3', 'description', 'category^2'], // Boosting 'name' field
        },
      },
      // ...
    }) as { // Cast to a minimal type to satisfy subsequent property access (hits/total.value)
         hits: { 
           hits: Array<{ _source: any }>, 
           total: { value: number } 
         } 
       }; 

    // Correct for v8+ client: Access hits and total directly from the 'response' object (no .body)
    const hits = response.hits.hits.map((hit: any) => hit._source);
    return { hits, total: response.hits.total.value };
  }
}