import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiProperty, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SearchService } from './search.service';

@ApiTags('Search')
@Controller('search')
export class SearchController {
    constructor(private readonly searchService: SearchService) {}

    @Get('products')
    @ApiOperation({ summary: 'Buscar productos por texto y filtros' })
    @ApiQuery({
        name: 'q',
        required: true,
        description: 'Texto a buscar (nombre, descripción, tags)',
        example: 'zapatos deportivos',
    })
    @ApiQuery({
        name: 'filters',
        required: false,
        description: 'Filtros opcionales en formato Meilisearch',
        example: 'categoryId = 2 AND price < 100',
    })
    @ApiResponse({
        status: 200,
        description: 'Lista de productos encontrados',
        schema: {
            example: {
                hits: [
                    {
                        id: '1',
                        name: 'Zapatos deportivos',
                        description: 'Cómodos para correr',
                        price: 99.99,
                        categoryId: 2,
                        storeId: 1,
                    },
                ],
                offset: 0,
                limit: 20,
                estimatedTotalHits: 1,
            },
        },
    })
    async searchProducts(
        @Query('q') q: string,
        @Query('filters') filters?: string,
    ) {
        return this.searchService.search(q, filters);
    }
}
