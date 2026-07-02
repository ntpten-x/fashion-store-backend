import { Controller, Post, Body, Get, Param, Put, Delete, Query } from '@nestjs/common';
import { SizeService } from './size.service';
import { CreateSizeDto } from './dtos/create-size.dto';
import { UpdateSizeDto } from './dtos/update-size.dto';
import { GetSizeDto } from './dtos/get-size.dto';

@Controller('size')
export class SizeController {
    constructor(private readonly sizeService: SizeService) { }

    @Post('create')
    async create(@Body() createSizeDto: CreateSizeDto) {
        return await this.sizeService.createSize(createSizeDto);
    }

    @Get('findAll')
    async findAll(@Query() query: GetSizeDto) {
        return await this.sizeService.getAllSizes(query);
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

