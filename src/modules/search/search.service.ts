import { Injectable, OnModuleInit } from '@nestjs/common';
import { MeiliSearch } from 'meilisearch';

@Injectable()
export class SearchService implements OnModuleInit {
    private client: MeiliSearch;
    private productsIndex;

    onModuleInit() {
        this.client = new MeiliSearch({
            host: process.env.MEILI_HOST!,
            apiKey: process.env.MEILI_API_KEY,
        });

        this.productsIndex = this.client.index('products');

        // Configuración inicial de filtros y atributos
        this.productsIndex.updateSettings({
            searchableAttributes: ['name', 'description', 'tags'],
            filterableAttributes: ['categoryId', 'storeId', 'price'],
            sortableAttributes: ['price', 'createdAt'],
        });
    }

    async indexProduct(product: any) {
        return this.productsIndex.addDocuments([product]);
    }

    async updateProduct(product: any) {
        return this.productsIndex.updateDocuments([product])
    }

    async removeProduct(productId: string) {
    return this.productsIndex.deleteDocument(productId);
    }

    async search(query: string, filters?: string) {
        return this.productsIndex.search(query, {
        filter: filters,
        limit: 20,
        });
    }
}
