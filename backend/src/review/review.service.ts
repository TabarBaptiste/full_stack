import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewService {
  constructor(private readonly databaseService: DatabaseService) { }

  async create(data: CreateReviewDto) {

    // Vérifier que l'utilisateur existe
    const user = await this.databaseService.user.findUnique({
      where: { id: data.userId }
    });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return this.databaseService.review.create({
      data: {
        rating: data.rating,
        content: data.content,
        visible: data.visible,
        userId: data.userId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstname: true,
            lastname: true,
          }
        },
      }
    });
  }

  async findAll(includeInvisible: boolean = false) {
    const whereCondition = includeInvisible ? {} : { visible: true };

    return this.databaseService.review.findMany({
      where: whereCondition,
      include: {
        user: {
          select: {
            id: true,
            // Ajoutez les autres champs utilisateur que vous voulez inclure
            // name: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async findOne(id: number) {
    const review = await this.databaseService.review.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            // Ajoutez les autres champs utilisateur que vous voulez inclure
            // name: true,
          }
        }
      }
    });

    if (!review) {
      throw new Error(`Review with ID ${id} not found`);
    }

    return review;
  }

  async findByUser(userId: number) {
    return this.databaseService.review.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            // Ajoutez les autres champs utilisateur que vous voulez inclure
            // name: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async update(id: number, updateReviewDto: UpdateReviewDto, userId?: number) {
    // Vérifier si la review existe et appartient à l'utilisateur (si userId est fourni)
    const existingReview = await this.databaseService.review.findUnique({
      where: { id }
    });

    if (!existingReview) {
      throw new Error(`Review with ID ${id} not found`);
    }

    // Si userId est fourni, vérifier que l'utilisateur est le propriétaire
    if (userId && existingReview.userId !== userId) {
      throw new Error(`You don't have permission to update this review`);
    }

    return this.databaseService.review.update({
      where: { id },
      data: {
        ...(updateReviewDto.rating !== undefined && { rating: updateReviewDto.rating }),
        ...(updateReviewDto.content !== undefined && { content: updateReviewDto.content }),
        ...(updateReviewDto.visible !== undefined && { visible: updateReviewDto.visible }),
      },
      include: {
        user: {
          select: {
            id: true,
            // Ajoutez les autres champs utilisateur que vous voulez inclure
            // name: true,
          }
        }
      }
    });
  }

  async remove(id: number, userId?: number) {
    // Vérifier si la review existe et appartient à l'utilisateur (si userId est fourni)
    const existingReview = await this.databaseService.review.findUnique({
      where: { id }
    });

    if (!existingReview) {
      throw new Error(`Review with ID ${id} not found`);
    }

    // Si userId est fourni, vérifier que l'utilisateur est le propriétaire
    if (userId && existingReview.userId !== userId) {
      throw new Error(`You don't have permission to delete this review`);
    }

    return this.databaseService.review.delete({
      where: { id }
    });
  }

  async getAverageRating() {
    const result = await this.databaseService.review.aggregate({
      where: { visible: true },
      _avg: {
        rating: true
      },
      _count: {
        rating: true
      }
    });

    return {
      averageRating: result._avg.rating || 0,
      totalReviews: result._count.rating || 0
    };
  }
}