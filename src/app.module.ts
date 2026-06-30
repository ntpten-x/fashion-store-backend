import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './supabase/supabase.module';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import databaseConfig from './config/database.config';
import { Products } from './products/entity/products.entity';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { SupabaseAuthGuard } from './auth/guards/supabase-auth.guard';
import { ColorsModule } from './colors/colors.module';
import { SizeModule } from './size/size.module';
import { CategoryModule } from './category/category.module';
import { Category } from './category/entity/category.entity';
import { Colors } from './colors/entity/colors.entity';
import { Size } from './size/entity/size.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(databaseConfig)],
      inject: [databaseConfig.KEY],
      useFactory: (config: ConfigType<typeof databaseConfig>) => ({
        type: 'postgres',
        host: config.host,
        port: Number(config.port),
        username: config.username,
        password: config.password,
        database: config.database,
        entities: [Products, Category, Colors, Size],
        synchronize: true,
        ssl: {
          rejectUnauthorized: false
        }
      }),
    }),
    SupabaseModule,
    ProductsModule,
    AuthModule,
    ColorsModule,
    SizeModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: SupabaseAuthGuard,
    }
  ],
})
export class AppModule { }
