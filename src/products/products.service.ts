import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { CreateProductsDto } from './dtos/create-products.dto';
import { UpdateProductsDto } from './dtos/update-products.dto';

@Injectable()
export class ProductsService {
    constructor(
        private readonly supabaseService: SupabaseService
    ) { }

    public async uploadImage(file: any) {
        const client = this.supabaseService.getClient();
        const bucketName = 'products';



        // Generate unique name
        const extension = file.originalname.split('.').pop() || 'png';
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${extension}`;

        // Upload to storage
        const { data, error } = await client.storage
            .from(bucketName)
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
                upsert: true
            });

        if (error) {
            throw new InternalServerErrorException(error.message);
        }

        // Retrieve public URL
        const { data: urlData } = client.storage
            .from(bucketName)
            .getPublicUrl(fileName);

        return {
            url: urlData.publicUrl
        };
    }

    public async findAll() {
        const { data, error } = await this.supabaseService.getClient()
            .from('products')
            .select(`
                *,
                category:category(category_name),
                size:size(size_name),
                products_colors_colors(colors(colors_name))
            `);

        if (error) {
            throw new InternalServerErrorException(error.message);
        }

        if (data) {
            data.forEach((product: any) => {
                product.category = product.category?.category_name || '';
                product.size = product.size?.size_name || '';
                const colorList = product.products_colors_colors?.map((item: any) => item.colors?.colors_name).filter(Boolean) || [];
                product.color = colorList[0] || '';
                delete product.products_colors_colors;
                delete product.categoryId;
                delete product.sizeId;
            });
        }

        return data;
    }

    public async findById(id: string) {
        const { data, error } = await this.supabaseService.getClient()
            .from('products')
            .select(`
                *,
                category:category(category_name),
                size:size(size_name),
                products_colors_colors(colors(colors_name))
            `)
            .eq('id', id)
            .single();

        if (error) {
            throw new InternalServerErrorException(error.message);
        }

        if (data) {
            data.category = data.category?.category_name || '';
            data.size = data.size?.size_name || '';
            const colorList = data.products_colors_colors?.map((item: any) => item.colors?.colors_name).filter(Boolean) || [];
            data.color = colorList[0] || '';
            delete data.products_colors_colors;
            delete data.categoryId;
            delete data.sizeId;
        }

        return data;
    }

    public async create(body: CreateProductsDto) {
        const { category, color, size, ...productData } = body;

        let categoryId = null;
        if (category) {
            const { data: catData } = await this.supabaseService.getClient()
                .from('category')
                .select('id')
                .eq('category_name', category)
                .maybeSingle();
            if (catData) categoryId = catData.id;
        }

        let sizeId = null;
        if (size) {
            const { data: szData } = await this.supabaseService.getClient()
                .from('size')
                .select('id')
                .eq('size_name', size)
                .maybeSingle();
            if (szData) sizeId = szData.id;
        }

        let colorId = null;
        if (color) {
            const { data: colData } = await this.supabaseService.getClient()
                .from('colors')
                .select('id')
                .eq('colors_name', color)
                .maybeSingle();
            if (colData) colorId = colData.id;
        }

        const { data, error } = await this.supabaseService.getClient()
            .from('products')
            .insert({
                ...productData,
                categoryId,
                sizeId
            })
            .select()
            .single();

        if (error) {
            throw new InternalServerErrorException(error.message);
        }

        if (data && colorId) {
            await this.supabaseService.getClient()
                .from('products_colors_colors')
                .insert({
                    productsId: data.id,
                    colorsId: colorId
                });
        }

        return this.findById(data.id);
    }

    public async update(id: string, body: UpdateProductsDto) {
        const { category, color, size, ...productData } = body;

        let categoryId: string | null | undefined = undefined;
        if (category !== undefined) {
            if (category === null || category === "") {
                categoryId = null;
            } else {
                const { data: catData } = await this.supabaseService.getClient()
                    .from('category')
                    .select('id')
                    .eq('category_name', category)
                    .maybeSingle();
                categoryId = catData ? catData.id : null;
            }
        }

        let sizeId: string | null | undefined = undefined;
        if (size !== undefined) {
            if (size === null || size === "") {
                sizeId = null;
            } else {
                const { data: szData } = await this.supabaseService.getClient()
                    .from('size')
                    .select('id')
                    .eq('size_name', size)
                    .maybeSingle();
                sizeId = szData ? szData.id : null;
            }
        }

        let colorId: string | null | undefined = undefined;
        if (color !== undefined) {
            if (color === null || color === "") {
                colorId = null;
            } else {
                const { data: colData } = await this.supabaseService.getClient()
                    .from('colors')
                    .select('id')
                    .eq('colors_name', color)
                    .maybeSingle();
                colorId = colData ? colData.id : null;
            }
        }

        const updatePayload: any = { ...productData };
        if (categoryId !== undefined) updatePayload.categoryId = categoryId;
        if (sizeId !== undefined) updatePayload.sizeId = sizeId;

        const { data, error } = await this.supabaseService.getClient()
            .from('products')
            .update(updatePayload)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw new InternalServerErrorException(error.message);
        }

        if (colorId !== undefined) {
            await this.supabaseService.getClient()
                .from('products_colors_colors')
                .delete()
                .eq('productsId', id);

            if (colorId) {
                await this.supabaseService.getClient()
                    .from('products_colors_colors')
                    .insert({
                        productsId: id,
                        colorsId: colorId
                    });
            }
        }

        return this.findById(id);
    }

    public async delete(id: string) {
        await this.supabaseService.getClient()
            .from('products_colors_colors')
            .delete()
            .eq('productsId', id);

        const { data, error } = await this.supabaseService.getClient()
            .from('products')
            .delete()
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw new InternalServerErrorException(error.message);
        }

        // Delete the associated image from Supabase Storage if it exists
        if (data && data.image) {
            try {
                // Extract file name from the public URL
                const parts = data.image.split('/');
                const fileName = parts[parts.length - 1];

                if (fileName) {
                    const client = this.supabaseService.getClient();
                    await client.storage
                        .from('products')
                        .remove([fileName]);
                }
            } catch (storageError) {
                console.warn(`Failed to delete storage image: ${storageError.message}`);
            }
        }

        return data;
    }

    public async deleteImageByUrl(url: string) {
        if (!url) return { success: false };
        try {
            const parts = url.split('/');
            const fileName = parts[parts.length - 1];
            if (fileName) {
                const client = this.supabaseService.getClient();
                await client.storage
                    .from('products')
                    .remove([fileName]);
                return { success: true };
            }
        } catch (error) {
            console.warn(`Failed to delete storage image: ${error.message}`);
        }
        return { success: false };
    }
}
