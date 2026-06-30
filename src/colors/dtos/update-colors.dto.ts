import { PartialType } from "@nestjs/mapped-types";
import { CreateColorsDto } from "./create-colors.dto";

export class UpdateColorsDto extends PartialType(CreateColorsDto) {}
