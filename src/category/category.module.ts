import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { SupabaseModule } from 'src/supabase/supabase.module';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService],
  imports: [SupabaseModule]
})
export class CategoryModule { }
