import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreatePrestationDto } from './dto/create-prestation.dto';
import { UpdatePrestationDto } from './dto/update-prestation.dto';
import { Prestation } from '@prisma/client';

@Injectable()
export class PrestationsService {
  constructor(private readonly prisma: DatabaseService) {}

  async create(createPrestationDto: CreatePrestationDto): Promise<Prestation> {
    try {
      // Vérifier que la catégorie existe
      const categoryExists = await this.prisma.category.findUnique({
        where: { id: createPrestationDto.categoryId || 1 }
      });

      if (!categoryExists) {
        throw new BadRequestException('Impossible de trouver la catégorie');
      }

      return await this.prisma.prestation.create({
        data: {
          title: createPrestationDto.title,
          description: createPrestationDto.description || '',
          duration: createPrestationDto.duration || 0,
          price: createPrestationDto.price,
          categoryId: createPrestationDto.categoryId || 1,
        },
        include: {
          category: true,
        },
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Erreur lors de la création de la prestation');
    }
  }

  async findAll(): Promise<Prestation[]> {
    return await this.prisma.prestation.findMany({
      include: {
        category: true,
        _count: {
          select: {
            reservations: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number): Promise<Prestation> {
    const prestation = await this.prisma.prestation.findUnique({
      where: { id },
      include: {
        category: true,
        reservations: {
          select: {
            id: true,
            startDate: true,
            endDate: true,
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
            reservations: true,
          },
        },
      },
    });

    if (!prestation) {
      throw new NotFoundException(`Impossible de trouver la prestation ${id}`);
    }

    return prestation;
  }

  async update(id: number, updatePrestationDto: UpdatePrestationDto): Promise<Prestation> {
    // Vérifier que la prestation existe
    const existingPrestation = await this.prisma.prestation.findUnique({
      where: { id },
    });

    if (!existingPrestation) {
      throw new NotFoundException(`Impossible de trouver la prestation ${id}`);
    }

    // Si categoryId est fourni, vérifier qu'elle existe
    if (updatePrestationDto.categoryId) {
      const categoryExists = await this.prisma.category.findUnique({
        where: { id: updatePrestationDto.categoryId },
      });

      if (!categoryExists) {
        throw new BadRequestException('Impossible de trouver la catégorie');
      }
    }

    try {
      return await this.prisma.prestation.update({
        where: { id },
        data: updatePrestationDto,
        include: {
          category: true,
        },
      });
    } catch (error) {
      throw new BadRequestException('Erreur lors de la mise à jour de la prestation');
    }
  }

  async remove(id: number): Promise<{ message: string; deletedPrestation: Prestation }> {
    // Vérifier que la prestation existe
    const existingPrestation = await this.prisma.prestation.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            reservations: true,
          },
        },
      },
    });

    if (!existingPrestation) {
      throw new NotFoundException(`Impossible de trouver la prestation ${id}`);
    }

    try {
      // Supprimer la prestation (les réservations restent pour l'historique)
      const deletedPrestation = await this.prisma.prestation.delete({
        where: { id },
        include: {
          category: true,
        },
      });

      return {
        message: `La prestation "${deletedPrestation.title}" a été supprimé. ${existingPrestation._count.reservations} reservation(s) were preserved for history.`,
        deletedPrestation,
      };
    } catch (error) {
      throw new BadRequestException('Erreur lors de la suppression de la prestation');
    }
  }

  // Méthodes utilitaires supplémentaires
  async findByCategory(categoryId: number): Promise<Prestation[]> {
    return await this.prisma.prestation.findMany({
      where: { categoryId },
      include: {
        category: true,
      },
      orderBy: {
        title: 'asc',
      },
    });
  }

  async searchPrestations(searchTerm: string): Promise<Prestation[]> {
    return await this.prisma.prestation.findMany({
      where: {
        OR: [
          {
            title: {
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
        title: 'asc',
      },
    });
  }
}