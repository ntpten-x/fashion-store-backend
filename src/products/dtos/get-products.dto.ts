import { IntersectionType } from "@nestjs/mapped-types";
import { IsDate, IsOptional, IsBoolean } from "class-validator";
import { PaginationQueryDto } from "src/common/pagination/dtos/paginaion-query.dto";
import { Transform } from "class-transformer";

class GetProductsBaseDto {
    @IsDate()
    @IsOptional()
    startDate?: Date;

    @IsDate()
    @IsOptional()
    endDate?: Date;

    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => {
        if (value === 'true' || value === 1 || value === '1') return true;
        if (value === 'false' || value === 0 || value === '0') return false;
        return value;
    })
    is_use?: boolean;
}

export class GetProductsDto extends IntersectionType(GetProductsBaseDto, PaginationQueryDto) { }