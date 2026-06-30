import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateColorsDto {
    @IsString()
    @IsNotEmpty()
    colors_name: string;

    @IsString()
    @IsNotEmpty()
    colors_code: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    categoryIds?: string[];
}

