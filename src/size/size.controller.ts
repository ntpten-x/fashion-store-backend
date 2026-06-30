import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { SizeService } from './size.service';
import { CreateSizeDto } from './dtos/create-size.dto';
import { UpdateSizeDto } from './dtos/update-size.dto';

@Controller('size')
export class SizeController {
    constructor(private readonly sizeService: SizeService) { }

    @Post('create')
    async create(@Body() createSizeDto: CreateSizeDto) {
        return await this.sizeService.createSize(createSizeDto);
    }

    @Get('findAll')
    async findAll() {
        return await this.sizeService.getAllSizes();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.sizeService.getSizeById(id);
    }

    @Put('update/:id')
    async update(@Param('id') id: string, @Body() updateSizeDto: UpdateSizeDto) {
        return await this.sizeService.updateSize(id, updateSizeDto);
    }

    @Delete('delete/:id')
    async remove(@Param('id') id: string) {
        return await this.sizeService.deleteSize(id);
    }
}

