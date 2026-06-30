import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { CreateSizeDto } from './dtos/create-size.dto';
import { UpdateSizeDto } from './dtos/update-size.dto';

@Injectable()
export class SizeService {
    constructor(
        private readonly supabase: SupabaseService,
    ) { }

    async createSize(sizeDto: CreateSizeDto) {
        const { categoryIds, ...sizeData } = sizeDto;

        const { data, error } = await this.supabase.getClient()
            .from('size')
            .insert(sizeData)
            .select()
            .single();

        if (error) {
            throw new InternalServerErrorException(error.message);
        }

        if (categoryIds && categoryIds.length > 0) {
            const relations = categoryIds.map(catId => ({
                sizeId: data.id,
                categoryId: catId
            }));

            const { error: relError } = await this.supabase.getClient()
                .from('size_use_category')
                .insert(relations);

            if (relError) {
                throw new InternalServerErrorException(relError.message);
            }
        }

        return this.getSizeById(data.id);
    }

    async getAllSizes() {
        const { data, error } = await this.supabase.getClient()
            .from('size')
            .select('*, size_use_category(category(*))');

        if (error) {
            throw new InternalServerErrorException(error.message);
        }

        if (data) {
            data.forEach((sz: any) => {
                sz.use = sz.size_use_category?.map((item: any) => item.category).filter(Boolean) || [];
                delete sz.size_use_category;
            });
        }

        return data;
    }

    async getSizeById(id: string) {
        const { data, error } = await this.supabase.getClient()
            .from('size')
            .select('*, size_use_category(category(*))')
            .eq('id', id)
            .single();

        if (error) {
            throw new InternalServerErrorException(error.message);
        }

        if (data) {
            data.use = data.size_use_category?.map((item: any) => item.category).filter(Boolean) || [];
            delete data.size_use_category;
        }

        return data;
    }

    async updateSize(id: string, sizeDto: UpdateSizeDto) {
        const { categoryIds, ...sizeData } = sizeDto;

        const { data, error } = await this.supabase.getClient()
            .from('size')
            .update(sizeData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw new InternalServerErrorException(error.message);
        }

        if (categoryIds !== undefined) {
            const { error: deleteError } = await this.supabase.getClient()
                .from('size_use_category')
                .delete()
                .eq('sizeId', id);

            if (deleteError) {
                throw new InternalServerErrorException(deleteError.message);
            }

            if (categoryIds.length > 0) {
                const relations = categoryIds.map(catId => ({
                    sizeId: id,
                    categoryId: catId
                }));

                const { error: relError } = await this.supabase.getClient()
                    .from('size_use_category')
                    .insert(relations);

                if (relError) {
                    throw new InternalServerErrorException(relError.message);
                }
            }
        }

        return this.getSizeById(id);
    }

    async deleteSize(id: string) {
        const { data, error } = await this.supabase.getClient()
            .from('size')
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


