import { Module } from '@nestjs/common';
import { SizeController } from './size.controller';
import { SizeService } from './size.service';
import { SupabaseModule } from 'src/supabase/supabase.module';

@Module({
  controllers: [SizeController],
  providers: [SizeService],
  imports: [SupabaseModule]
})
export class SizeModule {}
