import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { GetCategoryDto } from './dtos/get-category.dto';

@Injectable()
export class CategoryService {
    constructor(
        private readonly supabase: SupabaseService,
    ) { }

    async createCategory(category: CreateCategoryDto) {
        const { data, error } = await this.supabase.getClient()
            .from('category')
            .insert(category)
            .select()
            .single();

        if (error) {
            throw new InternalServerErrorException(error.message);
        }
        return data;
    }

    async getAllCategories(query?: GetCategoryDto) {
        const page = query?.page;
        const limit = query?.limit;

        let supabaseQuery = this.supabase.getClient()
            .from('category')
            .select('*', { count: 'exact' });

        if (page !== undefined && limit !== undefined) {
            const from = (page - 1) * limit;
            const to = page * limit - 1;
            supabaseQuery = supabaseQuery.range(from, to);
        }

        const { data, error, count } = await supabaseQuery;

        if (error) {
            throw new InternalServerErrorException(error.message);
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

    async getCategoryById(id: string) {
        const { data, error } = await this.supabase.getClient()
            .from('category')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            throw new InternalServerErrorException(error.message);
        }
        return data;
    }

    async updateCategory(id: string, category: UpdateCategoryDto) {
        const { data, error } = await this.supabase.getClient()
            .from('category')
            .update(category)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw new InternalServerErrorException(error.message);
        }
        return data;
    }

    async deleteCategory(id: string) {
        const { data, error } = await this.supabase.getClient()
            .from('category')
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
