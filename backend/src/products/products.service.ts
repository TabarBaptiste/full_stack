import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: DatabaseService) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      // Vérifier que la catégorie existe
      const categoryExists = await this.prisma.category.findUnique({
        where: { id: createProductDto.categoryId || 2 }
      });

      if (!categoryExists) {
        throw new BadRequestException('Category not found');
      }

      return await this.prisma.product.create({
        data: {
          name: createProductDto.name,
          description: createProductDto.description || '',
          stock: createProductDto.stock || 0,
          price: createProductDto.price,
          categoryId: createProductDto.categoryId || 2,
        },
        include: {
          category: true,
        },
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to create product');
    }
  }

  async findAll(): Promise<Product[]> {
    return await this.prisma.product.findMany({
      include: {
        category: true,
        _count: {
          select: {
            purchases: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        purchases: {
          select: {
            id: true,
            status: true,
            user: {
              select: {
                id: true,
                firstname: true,
                lastname: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            purchases: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    // Vérifier que la product existe
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Si categoryId est fourni, vérifier qu'elle existe
    if (updateProductDto.categoryId) {
      const categoryExists = await this.prisma.category.findUnique({
        where: { id: updateProductDto.categoryId },
      });

      if (!categoryExists) {
        throw new BadRequestException('Category not found');
      }
    }

    try {
      return await this.prisma.product.update({
        where: { id },
        data: updateProductDto,
        include: {
          category: true,
        },
      });
    } catch (error) {
      throw new BadRequestException('Failed to update product');
    }
  }

  async remove(id: number): Promise<{ message: string; deletedProduct: Product }> {
    // Vérifier que la product existe
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            purchases: true,
          },
        },
      },
    });

    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    try {
      // Supprimer la product (les réservations restent pour l'historique)
      const deletedProduct = await this.prisma.product.delete({
        where: { id },
        include: {
          category: true,
        },
      });

      return {
        message: `Product "${deletedProduct.name}" has been successfully deleted. ${existingProduct._count.purchases} reservation(s) were preserved for history.`,
        deletedProduct,
      };
    } catch (error) {
      throw new BadRequestException('Failed to delete product');
    }
  }

  // Méthodes utilitaires supplémentaires
  async findByCategory(categoryId: number): Promise<Product[]> {
    return await this.prisma.product.findMany({
      where: { categoryId },
      include: {
        category: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async searchProducts(searchTerm: string): Promise<Product[]> {
    return await this.prisma.product.findMany({
      where: {
        OR: [
          {
            name: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        ],
      },
      include: {
        category: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }
}