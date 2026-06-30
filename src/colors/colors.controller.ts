import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { ColorsService } from './colors.service';
import { CreateColorsDto } from './dtos/create-colors.dto';
import { UpdateColorsDto } from './dtos/update-colors.dto';
import { DataSource } from 'typeorm';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('colors')
export class ColorsController {
    constructor(
        private readonly colorsService: ColorsService,
        private readonly dataSource: DataSource
    ) { }

    @Post('create')
    async create(@Body() createColorsDto: CreateColorsDto) {
        return await this.colorsService.createColor(createColorsDto);
    }

    @Get('findAll')
    async findAll() {
        return await this.colorsService.getAllColors();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.colorsService.getColorById(id);
    }

    @Put('update/:id')
    async update(@Param('id') id: string, @Body() updateColorsDto: UpdateColorsDto) {
        return await this.colorsService.updateColor(id, updateColorsDto);
    }

    @Delete('delete/:id')
    async remove(@Param('id') id: string) {
        return await this.colorsService.deleteColor(id);
    }
}

