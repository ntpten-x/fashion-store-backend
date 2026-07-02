import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { CreateColorsDto } from './dtos/create-colors.dto';
import { UpdateColorsDto } from './dtos/update-colors.dto';
import { GetColorsDto } from './dtos/get-colors.dto';

@Injectable()
export class ColorsService {
    constructor(
        private readonly supabase: SupabaseService,
    ) { }

    async createColor(colorDto: CreateColorsDto) {
        const { categoryIds, ...colorData } = colorDto;

        const { data, error } = await this.supabase.getClient()
            .from('colors')
            .insert(colorData)
            .select()
            .single();

        if (error) {
            throw new InternalServerErrorException(error.message);
        }

        if (categoryIds && categoryIds.length > 0) {
            const relations = categoryIds.map(catId => ({
                colorsId: data.id,
                categoryId: catId
            }));

            const { error: relError } = await this.supabase.getClient()
                .from('colors_use_category')
                .insert(relations);

            if (relError) {
                throw new InternalServerErrorException(relError.message);
            }
        }

        return this.getColorById(data.id);
    }

    async getAllColors(query?: GetColorsDto) {
        const page = query?.page;
        const limit = query?.limit;

        let supabaseQuery = this.supabase.getClient()
            .from('colors')
            .select('*, colors_use_category(category(*))', { count: 'exact' });

        if (page !== undefined && limit !== undefined) {
            const from = (page - 1) * limit;
            const to = page * limit - 1;
            supabaseQuery = supabaseQuery.range(from, to);
        }

        const { data, error, count } = await supabaseQuery;

        if (error) {
            throw new InternalServerErrorException(error.message);
        }

        if (data) {
            data.forEach((color: any) => {
                color.use = color.colors_use_category?.map((item: any) => item.category).filter(Boolean) || [];
                delete color.colors_use_category;
            });
        }

        if (page !== undefined && limit !== undefined) {
            return {
                data,
                total: count || 0,
                page,
                limit
            };
        }

        return data;
    }

    async getColorById(id: string) {
        const { data, error } = await this.supabase.getClient()
            .from('colors')
            .select('*, colors_use_category(category(*))')
            .eq('id', id)
            .single();

        if (error) {
            throw new InternalServerErrorException(error.message);
        }

        if (data) {
            data.use = data.colors_use_category?.map((item: any) => item.category).filter(Boolean) || [];
            delete data.colors_use_category;
        }

        return data;
    }

    async updateColor(id: string, colorDto: UpdateColorsDto) {
        const { categoryIds, ...colorData } = colorDto;

        const { data, error } = await this.supabase.getClient()
            .from('colors')
            .update(colorData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw new InternalServerErrorException(error.message);
        }

        if (categoryIds !== undefined) {
            const { error: deleteError } = await this.supabase.getClient()
                .from('colors_use_category')
                .delete()
                .eq('colorsId', id);

            if (deleteError) {
                throw new InternalServerErrorException(deleteError.message);
            }

            if (categoryIds.length > 0) {
                const relations = categoryIds.map(catId => ({
                    colorsId: id,
                    categoryId: catId
                }));

                const { error: relError } = await this.supabase.getClient()
                    .from('colors_use_category')
                    .insert(relations);

                if (relError) {
                    throw new InternalServerErrorException(relError.message);
                }
            }
        }

        return this.getColorById(id);
    }

    async deleteColor(id: string) {
        const { data, error } = await this.supabase.getClient()
            .from('colors')
            .delete()
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw new InternalServerErrorException(error.message);
        }
        return data;
    }
}


