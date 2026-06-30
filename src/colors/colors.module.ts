import { Module } from '@nestjs/common';
import { ColorsController } from './colors.controller';
import { ColorsService } from './colors.service';
import { SupabaseModule } from 'src/supabase/supabase.module';

@Module({
  controllers: [ColorsController],
  providers: [ColorsService],
  imports: [SupabaseModule]
})
export class ColorsModule {}
