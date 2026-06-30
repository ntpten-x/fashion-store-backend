import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';

@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) { }
    @Post('create')
    async create(@Body() createCategoryDto: CreateCategoryDto) {
        return await this.categoryService.createCategory(createCategoryDto);
    }
    @Get('findAll')
    async findAll() {
        return await this.categoryService.getAllCategories();
    }
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.categoryService.getCategoryById(id);
    }
    @Put('update/:id')
    async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
        return await this.categoryService.updateCategory(id, updateCategoryDto);
    }
    @Delete('delete/:id')
    async remove(@Param('id') id: string) {
        return await this.categoryService.deleteCategory(id);
    }
}
