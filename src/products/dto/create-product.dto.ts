import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateProductDto {

  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsNotEmpty()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(0)
  price?: number;

  @IsNotEmpty()
  @IsString()
  category?: string;

  @IsNumber()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsString()
  image?: string;
}
