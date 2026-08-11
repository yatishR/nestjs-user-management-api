import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import {
  Product,
  ProductDocument,
} from './schemas/product.schema';

import { Model } from 'mongoose';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}
 async  create(createProductDto: CreateProductDto) {
    const product = await this.productModel.create(createProductDto);

    return {
      success: true,
      message: 'Product created successfully',
      data: product
    };
  }

  async findAll(query: ProductQueryDto) {
     const {
    page = 1,
    limit = 10,
    search,
    category,
    minPrice,
    maxPrice,
    sort = 'createdAt',
    order = 'desc',
  } = query;
  const filter: any = {};

  if (search) {
    filter.$or = [
      {
        name: {
          $regex: search,
          $options: 'i',
        },
      },
      {
        description: {
          $regex: search,
          $options: 'i',
        },
      },
    ];
  }

  // Category filter
  if (category) {
    filter.category = {
      $regex: `^${category}$`,
      $options: 'i',
    };
  }

  // Price filter
  if (
    minPrice !== undefined ||
    maxPrice !== undefined
  ) {
    filter.price = {};

    if (minPrice !== undefined) {
      filter.price.$gte = minPrice;
    }

    if (maxPrice !== undefined) {
      filter.price.$lte = maxPrice;
    }
  }

  // Pagination
  const skip = (page - 1) * limit;

  // Sorting
  const sortOrder = order === 'asc' ? 1 : -1;
   
   const products = await this.productModel
    .find(filter)
    .sort({
      [sort]: sortOrder,
    })
    .skip(skip)
    .limit(limit);

     // Total records
  const total =
    await this.productModel.countDocuments(filter);

     const totalPages = Math.ceil(total / limit);
      return {
    success: true,
    data: products,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
  }

  

  async findOne(id: string) {
   const product = await this.productModel.findById(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return {
      success: true,
      message: 'Product retrieved successfully',
      data: product
    };
  }

  // async update(id: number, updateProductDto: UpdateProductDto) {

  //   const product = await this.productModel.findByIdAndUpdate(id, 
  //     updateProductDto, 
  //     { 
  //     returnDocument: 'after',
  //     runValidators: true,
    
  //       }
  //   );

  //   if (!product) {
  //     throw new NotFoundException('Product not found');
  //   }
  //   return {
  //     success: true,
  //     message: 'Product updated successfully',
  //     data: product
  //   };
  // }

  async update(
  id: string,
  updateProductDto: UpdateProductDto,
) {
  const product = await this.productModel.findByIdAndUpdate(
    id,
    updateProductDto,
    {
      returnDocument: 'after',
      runValidators: true,
    },
  );

  if (!product) {
    throw new NotFoundException('Product not found');
  }

  return {
    success: true,
    message: 'Product updated successfully',
    data: product,
  };
}

  async remove(id: string) {
    const product = await this.productModel.findByIdAndDelete(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return {
      success: true,
      message: 'Product removed successfully',
      data: product
    };
  }
}
