import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductsDto } from './dtos/create-products.dto';
import { UpdateProductsDto } from './dtos/update-products.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/auth/decorators/public.decorator';
import { GetProductsDto } from './dtos/get-products.dto';

@Controller('products')
export class ProductsController {
    constructor(
        private readonly productsService: ProductsService
    ) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    public async uploadImage(@UploadedFile() file: any) {
        return await this.productsService.uploadImage(file);
    }

    @Post('delete-image')
    public async deleteImage(@Body('url') url: string) {
        return await this.productsService.deleteImageByUrl(url);
    }

    @Post('create')
    public async createProduct(@Body() product: CreateProductsDto) {
        return await this.productsService.create(product);
    }

    @Public()
    @Get('findAll')
    public async getProducts(@Query() query: GetProductsDto) {
        return await this.productsService.findAll(query);
    }

    @Public()
    @Get(':id')
    public async getProductById(@Param('id') id: string) {
        return await this.productsService.findById(id);
    }

    @Put('update/:id')
    public async updateProduct(@Param('id') id: string, @Body() product: UpdateProductsDto) {
        return await this.productsService.update(id, product);
    }

    @Delete('delete/:id')
    public async deleteProduct(@Param('id') id: string) {
        return await this.productsService.delete(id);
    }
}
