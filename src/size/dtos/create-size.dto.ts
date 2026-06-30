import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateSizeDto {
    @IsString()
    @IsNotEmpty()
    size_name: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    categoryIds?: string[];
}

