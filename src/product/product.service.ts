import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Like, Repository } from 'typeorm';
import { ProductEntity } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { GetProductsDto } from './dto/get-products.dto';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { ProductCategoryEntity } from './entities/product-category.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(ProductCategoryEntity)
    private readonly productCategoryRepository: Repository<ProductCategoryEntity>,
  ) {}
  async create(dto: CreateProductDto): Promise<ProductEntity> {
    return await this.productRepository.save(dto);
  }

  async findAll(query: GetProductsDto): Promise<ProductEntity[]> {
    const { take = 10, skip = 0, keyword = '', field = 'name' } = query;

    return await this.productRepository.find({
      where: { [field]: Like('%' + keyword + '%') },
      order: { [field]: 'DESC' },
      take,
      skip,
    });
  }

  async findOne(id: number): Promise<ProductEntity> {
    return await this.productRepository.findOneBy({ id });
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductEntity> {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Product not found`);
    }
    Object.assign(product, updateProductDto);
    return await this.productRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Product not found`);
    }
  }

  async createCategory(
    dto: CreateProductCategoryDto,
  ): Promise<ProductCategoryEntity> {
    return await this.productCategoryRepository.save(dto);
  }
}
